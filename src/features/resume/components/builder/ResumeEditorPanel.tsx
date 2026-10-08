import type {
  ResumeSectionKey,
  ResumeBuilderData,
} from '../../types/builder.types'
import PersonalInfoEditor from './PersonalInfoEditor'
import SummaryEditor from './SummaryEditor'
import ExperienceEditor from './ExperienceEditor'
import EducationEditor from './EducationEditor'
import SkillsEditor from './SkillsEditor'
import ProjectsEditor from './ProjectsEditor'
import CertificationsEditor from './CertificationsEditor'
import AchievementsEditor from './AchievementsEditor'
import CustomSectionEditor from './CustomSectionEditor'

interface Props {
  activeSection: ResumeSectionKey
  data: ResumeBuilderData
  onChange: (updated: ResumeBuilderData) => void
  onImproveWithAI: (text: string, context: string, fieldTarget?: string) => void
}

export default function ResumeEditorPanel({
  activeSection,
  data,
  onChange,
  onImproveWithAI,
}: Props) {
  const renderEditor = () => {
    switch (activeSection) {
      case 'personal':
        return (
          <PersonalInfoEditor
            data={data.personalInfo}
            onChange={(personalInfo) => onChange({ ...data, personalInfo })}
          />
        )
      case 'summary':
        return (
          <SummaryEditor
            summary={data.summary}
            onChange={(summary) => onChange({ ...data, summary })}
            onImproveWithAI={(text, context) => onImproveWithAI(text, context, 'summary')}
          />
        )
      case 'experience':
        return (
          <ExperienceEditor
            experience={data.experience}
            onChange={(experience) => onChange({ ...data, experience })}
            onImproveBulletWithAI={(bulletText, context) =>
              onImproveWithAI(bulletText, context, 'experience_bullet')
            }
          />
        )
      case 'education':
        return (
          <EducationEditor
            education={data.education}
            onChange={(education) => onChange({ ...data, education })}
          />
        )
      case 'skills':
        return (
          <SkillsEditor
            skills={data.skills}
            onChange={(skills) => onChange({ ...data, skills })}
          />
        )
      case 'projects':
        return (
          <ProjectsEditor
            projects={data.projects}
            onChange={(projects) => onChange({ ...data, projects })}
            onImproveDescriptionWithAI={(text, context) =>
              onImproveWithAI(text, context, 'project_description')
            }
          />
        )
      case 'certifications':
        return (
          <CertificationsEditor
            certifications={data.certifications}
            onChange={(certifications) => onChange({ ...data, certifications })}
          />
        )
      case 'achievements':
        return (
          <AchievementsEditor
            achievements={data.achievements}
            onChange={(achievements) => onChange({ ...data, achievements })}
          />
        )
      case 'custom':
        return (
          <CustomSectionEditor
            customSections={data.customSections}
            onChange={(customSections) => onChange({ ...data, customSections })}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-xl p-4 sm:p-5 shadow-2xs overflow-y-auto">
      {renderEditor()}
    </div>
  )
}
