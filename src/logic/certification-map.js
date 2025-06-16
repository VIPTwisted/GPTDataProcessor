
export const CERTIFICATION_PATH = [
  { id: 'starter', title: 'Starter', requirement: 0, color: 'gray' },
  { id: 'certified', title: 'Certified Rep', requirement: 3, color: 'blue' },
  { id: 'leader', title: 'Party Leader', requirement: 6, color: 'green' },
  { id: 'ambassador', title: 'Brand Ambassador', requirement: 10, color: 'purple' },
  { id: 'trainer', title: 'Field Trainer', requirement: 15, color: 'gold' }
];

export const getRepCertLevel = (completedCourses) => {
  const sortedPath = [...CERTIFICATION_PATH].reverse();
  return sortedPath.find(c => completedCourses >= c.requirement) || CERTIFICATION_PATH[0];
}
export const getNextCertLevel = (completedCourses) => {
  const currentLevel = getRepCertLevel(completedCourses);
  const currentIndex = CERTIFICATION_PATH.findIndex(c => c.id === currentLevel.id);
  return CERTIFICATION_PATH[currentIndex + 1] || null;
}
export const getCertificationProgress = (completedCourses) => {
  const currentLevel = getRepCertLevel(completedCourses);
  const nextLevel = getNextCertLevel(completedCourses);
  
  if (!nextLevel) {
    return { progress: 100, isMaxLevel: true }
  }
  
  const progressToNext = completedCourses - currentLevel.requirement;
  const totalNeeded = nextLevel.requirement - currentLevel.requirement;
  const progress = Math.min(100, (progressToNext / totalNeeded) * 100);
  
  return { progress, isMaxLevel: false, coursesNeeded: nextLevel.requirement - completedCourses }
}