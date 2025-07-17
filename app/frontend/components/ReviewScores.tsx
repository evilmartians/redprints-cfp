import React from 'react';

interface ReviewScoresProps {
  scores: Record<string,number> | undefined;
}

const scoreClass = (value: number) => {
  switch(value){
    case 1:
      return 'font-bold bg-red-800 text-white border-red-800';
    case 2:
      return 'bg-orange-600 border-orange-600 text-white';
    case 4:
      return 'text-green-600 border-cloud-300 bg-white';
    case 5:
      return 'border-green-800 bg-green-800 font-bold text-white';
    default:
      return 'bg-white';
  }
}

const ReviewScores: React.FC<ReviewScoresProps> = ({ scores }) => {
  if (!scores || Object.keys(scores).length === 0) {
    return null;
  }

  return <div className="text-xs text-cloud-600 font-mono">
    {Object.values(scores).map((score) => <span className={`${scoreClass(score)} border rounded-sm mx-1 px-1 py-0.5`}>{score}</span>)}
  </div>
}

export default ReviewScores;
