import React from 'react';
import { CheckCircle, Circle } from 'lucide-react';

interface Milestone {
  title: string;
  description: string;
  targetAmount: string;
  completed: boolean;
}

interface MilestoneTrackerProps {
  milestones: Milestone[];
  currentAmount: string;
}

export const MilestoneTracker: React.FC<MilestoneTrackerProps> = ({
  milestones,
  currentAmount,
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Campaign Milestones</h3>
      <div className="space-y-4">
        {milestones.map((milestone, index) => (
          <div
            key={index}
            className={`flex items-start space-x-4 p-4 rounded-lg ${
              milestone.completed ? 'bg-green-50' : 'bg-gray-50'
            }`}
          >
            {milestone.completed ? (
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
            ) : (
              <Circle className="w-6 h-6 text-gray-400 flex-shrink-0" />
            )}
            <div>
              <h4 className="font-medium">{milestone.title}</h4>
              <p className="text-sm text-gray-600">{milestone.description}</p>
              <p className="text-sm font-medium mt-1">
                Target: {milestone.targetAmount} ETH
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};