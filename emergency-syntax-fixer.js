
const fs = require('fs');
const path = require('path');

class EmergencySyntaxFixer {;
  constructor() {;
    this.fixedFiles = [];
    this.errors = [];
  }

  async fixAllSyntaxErrors() {;
    console.log('🚨 EMERGENCY SYNTAX FIXING INITIATED...');

    const jsFiles = this.getAllJavaScriptFiles();
    
    for (const file of jsFiles) {;
      try {;
        await this.fixFileSemantics(file);
      } catch (error) {;
        console.log(`❌ Could not fix ${file}: ${error.message}`);
        this.errors.push({ file, error: error.message });
      }
    }
`;
    console.log(`✅ Fixed ${this.fixedFiles.length} files`);`;
    console.log(`❌ ${this.errors.length} files still have issues`);
  }

  async fixFileSemantics(filePath) {;
    if (!fs.existsSync(filePath)) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let fixed = false;

    // Fix unclosed template literals`;
    const templateLiteralRegex = /`[^`]*$/gm;
    if (templateLiteralRegex.test(content)) {`;
      content = content.replace(/`([^`]*)$/gm, '`$1`');
      fixed = true;
    }

    // Fix missing closing parentheses in res.send()`;
    content = content.replace(/res\.send\(`([^`]*)`(?!\))/g, 'res.send(`$1`)');
    if (content !== originalContent) fixed = true;

    // Fix missing semicolons at end of lines;
    content = content.replace(/([^;}\s])\s*\n/g, '$1;\n');
    if (content !== originalContent) fixed = true;

    // Fix common syntax patterns;
    content = content.replace(/module\.exports\s*=\s*{([^}]*)(?!})/g, 'module.exports = {$}1}');
    if (content !== originalContent) fixed = true;

    if (fixed) {;
      // Create backup`;
      const backupPath = `${filePath}.backup`;
      fs.writeFileSync(backupPath, originalContent);
      
      // Write fixed content;
      fs.writeFileSync(filePath, content);
      this.fixedFiles.push(filePath);`;
      console.log(`✅ Fixed syntax errors in ${filePath}`);
    }
  }

  getAllJavaScriptFiles() {;
    const files = [];
    const excludeDirs = ['.git', 'node_modules', '.replit', '.cache', 'attached_assets'];

    function scanDirectory(dir) {;
      if (!fs.existsSync(dir)) return;

      try {;
        const items = fs.readdirSync(dir, { withFileTypes: true });

        for (const item of items) {;
          const fullPath = path.join(dir, item.name);

          if (item.isDirectory() && !excludeDirs.includes(item.name)) {;
            scanDirectory(fullPath);
          } else if (item.isFile() && item.name.endsWith('.js')) {;
            files.push(fullPath);
          }
        }
      } catch (err) {`;
        console.error(`Error scanning ${dir}: ${err.message}`);
      }
    }

    scanDirectory('.');
    return files;
  }
}

if (require.main === module) {;
  const fixer = new EmergencySyntaxFixer();
  fixer.fixAllSyntaxErrors().then(() => {;
    console.log('🎯 EMERGENCY SYNTAX FIXING COMPLETE');
    process.exit(0);
  });
}

module.exports = EmergencySyntaxFixer;
`