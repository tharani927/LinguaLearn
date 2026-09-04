import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

const SkillChart = ({ skills, type = 'radar' }) => {
  if (!skills || skills.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-slate-400">
        No assessment data yet. Complete an assessment to see skill diagnostics!
      </div>
    );
  }

  const formattedData = skills.map((s) => ({
    skill: s.skill_category.replace('_', ' ').toUpperCase(),
    score: parseFloat(s.proficiency_score) || 0,
    assessments: s.assessments_taken || 0,
  }));

  if (type === 'bar') {
    return (
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <XAxis dataKey="skill" tick={{ fontSize: 10 }} interval={0} angle={-15} textAnchor="end" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '12px',
              }}
            />
            <Bar dataKey="score" fill="#0d9488" radius={[4, 4, 0, 0]} name="Proficiency %" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={formattedData}>
          <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" opacity={0.5} />
          <PolarAngleAxis dataKey="skill" tick={{ fontSize: 10, fill: '#64748b' }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
          <Radar
            name="Proficiency"
            dataKey="score"
            stroke="#0d9488"
            fill="#0d9488"
            fillOpacity={0.4}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.9)',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '12px',
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SkillChart;
