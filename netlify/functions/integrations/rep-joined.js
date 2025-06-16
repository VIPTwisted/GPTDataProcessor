
const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    const { repId, repName, email, phone, tier, referralCode, recruiterRepId } = JSON.parse(event.body || '{}');

    if (!repId || !repName || !email) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'repId, repName, and email are required' })
      }
    }

    // Trigger webhook dispatch for new rep
    const webhookResponse = await fetch(`${process.env.URL || 'https://toyparty.netlify.app'}/.netlify/functions/integrations/webhook-dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventType: 'rep-joined',
        payload: { 
          repId,
          repName,
          email,
          phone: phone || 'Not provided',
          tier: tier || 'Starter',
          referralCode: referralCode || null,
          recruiterRepId: recruiterRepId || null,
          joinedAt: new Date().toISOString(),
          welcomePackageSent: true,
          onboardingStatus: 'initiated',
          estimatedFirstSaleDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
        }
      })
    });

    const webhookResult = await webhookResponse.json();

    // Create welcome sequence
    const welcomeSequence = {
      day1: 'Welcome email with login credentials',
      day2: 'Product training video access',
      day3: 'First mentor call scheduled',
      day7: 'Check-in and first goal setting'
    }
    console.log('🎉 New Rep Joined:', { repId, repName, email });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        status: 'Rep registration processed',
        repId,
        repName,
        webhookTriggered: webhookResponse.ok,
        webhookResult: webhookResult,
        welcomeSequence
      })
    }
  } catch (error) {
    console.error('❌ Rep registration error:', error);

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({ 
        error: 'Rep registration failed',
        message: error.message 
      })
    }
  }
}