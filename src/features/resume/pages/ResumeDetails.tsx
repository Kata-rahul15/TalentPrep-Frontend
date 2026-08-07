import { motion } from 'framer-motion'
import {
  User,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Award,
  Code2,
  Mail,
  Phone,
  MapPin,
  GitBranch,
  Link2,
  ExternalLink,
} from 'lucide-react'
import { useResumeDetails } from '../hooks/useResume'
import { PageLoading, PageError } from '../components/ResumeUI'
import ExpandableCard from '../components/ExpandableCard'
import SkillBadge from '../components/SkillBadge'

function DateRange({ start, end }: { start: string; end: string | null | number; }) {
  const fmt = (s: string | number) => {
    if (typeof s === 'number') return s.toString()
    const [y, m] = s.split('-')
    const date = new Date(parseInt(y), parseInt(m) - 1)
    return new Intl.DateTimeFormat('en-US', { month: 'short', year: 'numeric' }).format(date)
  }
  return (
    <span className="text-xs text-muted-foreground">
      {fmt(start)} – {end ? fmt(end) : 'Present'}
    </span>
  )
}

export default function ResumeDetails() {
  const { data: resume, isLoading, isError, refetch } = useResumeDetails()

  if (isLoading) return <PageLoading message="Loading resume details..." />
  if (isError || !resume) return <PageError message="Could not load resume details." onRetry={refetch} />

  return (
    <div className="space-y-5">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-heading font-black text-2xl text-foreground">Resume Details</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Extracted and structured content from your resume</p>
      </motion.div>

      {/* Profile Hero Card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row items-start gap-5"
      >
        <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-heading font-black text-2xl flex-shrink-0">
          {resume.name.split(' ').map((n) => n[0]).join('')}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-heading font-bold text-xl text-foreground">{resume.name}</h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-2">
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Mail className="w-3.5 h-3.5" /> {resume.email}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Phone className="w-3.5 h-3.5" /> {resume.phone}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" /> {resume.location}
            </span>
          </div>
          <div className="flex gap-3 mt-2">
            {resume.linkedIn && (
              <a href={`https://${resume.linkedIn}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                <Link2 className="w-3.5 h-3.5" /> LinkedIn <ExternalLink className="w-3 h-3" />
              </a>
            )}
            {resume.github && (
              <a href={`https://${resume.github}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                <GitBranch className="w-3.5 h-3.5" /> GitHub <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
      </motion.div>

      {/* Professional Summary */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <ExpandableCard
          title="Professional Summary"
          icon={<User className="w-4 h-4" />}
          defaultOpen
        >
          <p className="text-sm text-secondary-foreground leading-relaxed">{resume.professionalSummary}</p>
        </ExpandableCard>
      </motion.div>

      {/* Skills */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13 }}>
        <ExpandableCard
          title="Technical Skills"
          subtitle={`${resume.skills.length} skills identified`}
          icon={<Code2 className="w-4 h-4" />}
          badge={<span className="text-xs font-semibold text-muted-foreground">{resume.skills.length}</span>}
          defaultOpen
        >
          <div className="flex flex-wrap gap-2">
            {resume.skills.map((skill) => (
              <SkillBadge key={skill} label={skill} variant="primary" />
            ))}
          </div>
        </ExpandableCard>
      </motion.div>

      {/* Work Experience */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
        <ExpandableCard
          title="Work Experience"
          subtitle={`${resume.workExperience.length} positions`}
          icon={<Briefcase className="w-4 h-4" />}
          badge={<span className="text-xs font-semibold text-muted-foreground">{resume.workExperience.length}</span>}
          defaultOpen
        >
          <div className="space-y-6">
            {resume.workExperience.map((exp) => (
              <div key={exp.id} className="relative pl-4 border-l-2 border-border">
                <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary border-2 border-card" />
                <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                  <div>
                    <h4 className="font-semibold text-sm text-foreground">{exp.role}</h4>
                    <p className="text-xs text-primary font-medium">{exp.company}</p>
                  </div>
                  <DateRange start={exp.startDate} end={exp.endDate} />
                </div>
                <ul className="space-y-1.5 mb-3">
                  {exp.description.map((point, i) => (
                    <li key={i} className="text-xs text-secondary-foreground leading-relaxed flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-primary/60 mt-1.5 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-1.5">
                  {exp.technologies.map((tech) => (
                    <SkillBadge key={tech} label={tech} size="sm" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ExpandableCard>
      </motion.div>

      {/* Projects */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.19 }}>
        <ExpandableCard
          title="Projects"
          subtitle={`${resume.projects.length} projects`}
          icon={<FolderGit2 className="w-4 h-4" />}
          badge={<span className="text-xs font-semibold text-muted-foreground">{resume.projects.length}</span>}
          defaultOpen
        >
          <div className="space-y-6">
            {resume.projects.map((project) => (
              <div key={project.id} className="bg-secondary-bg/30 rounded-xl border border-border p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-semibold text-sm text-foreground">{project.name}</h4>
                  {project.repoUrl && (
                    <a href={`https://${project.repoUrl}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-primary hover:underline flex-shrink-0"
                    >
                      <GitBranch className="w-3.5 h-3.5" /> Repo
                    </a>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">{project.description}</p>
                <ul className="space-y-1 mb-3">
                  {project.highlights.map((h, i) => (
                    <li key={i} className="text-xs text-secondary-foreground flex items-start gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-success/70 mt-1.5 flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.map((tech) => (
                    <SkillBadge key={tech} label={tech} size="sm" variant="primary" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ExpandableCard>
      </motion.div>

      {/* Education */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
        <ExpandableCard
          title="Education"
          icon={<GraduationCap className="w-4 h-4" />}
          defaultOpen
        >
          <div className="space-y-4">
            {resume.education.map((edu) => (
              <div key={edu.id} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary-bg border border-border flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-foreground">{edu.degree} in {edu.field}</h4>
                  <p className="text-xs text-primary font-medium">{edu.institution}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {edu.startYear} – {edu.endYear ?? 'Present'}
                    {edu.gpa && <span className="ml-2 font-semibold text-foreground">GPA: {edu.gpa}</span>}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ExpandableCard>
      </motion.div>

      {/* Certifications */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <ExpandableCard
          title="Certifications"
          subtitle={`${resume.certifications.length} certifications`}
          icon={<Award className="w-4 h-4" />}
          badge={<span className="text-xs font-semibold text-muted-foreground">{resume.certifications.length}</span>}
          defaultOpen
        >
          <div className="space-y-3">
            {resume.certifications.map((cert) => (
              <div key={cert.id} className="flex items-start gap-3 p-3 bg-secondary-bg/30 rounded-xl border border-border">
                <Award className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-xs text-foreground">{cert.name}</p>
                  <p className="text-xs text-muted-foreground">{cert.issuer} · {cert.date}</p>
                  {cert.credentialId && (
                    <p className="text-[10px] text-muted-foreground/70 font-mono mt-0.5">{cert.credentialId}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ExpandableCard>
      </motion.div>
    </div>
  )
}
