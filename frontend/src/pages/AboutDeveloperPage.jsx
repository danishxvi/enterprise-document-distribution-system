import { Code2, Github, GraduationCap, Linkedin, Mail, Sparkles, Wrench } from 'lucide-react'
import Card from '../components/ui/Card'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'

// -----------------------------------------------------------------------------
// Edit this block to personalise the page. Everything the page renders is
// driven from here, so there is no need to touch the markup below.
// -----------------------------------------------------------------------------
const DEVELOPER = {
  name: 'Danish Husain',
  role: 'Full stack developer',
  // Set this to the exact organisation name if you want it shown publicly.
  // It is left generic by default to keep the internal project unattributed.
  context: 'a large public transit organisation',
  lead:
    'A full stack developer who enjoys turning real world processes into clean, dependable software, from the API and the tests all the way to the deployment.',
  bio: [
    'I am a software developer with a strong foundation in Core Java, object oriented programming and full stack web development. I work across the stack, Spring Boot on Java 21 at the backend and React on the front end, and I enjoy the whole cycle of building software: designing clean APIs, writing unit tested business logic, implementing proper authentication and data security, and shipping containerized deployments that actually run in production.',
    'I am continuing to strengthen my problem solving through data structures and algorithms, and I like learning by building. Every project is a chance to pick up something new, whether that is a design pattern, a security practice or a cleaner way to structure an API.',
  ],
  links: {
    github: 'https://github.com/danishxvi',
    linkedin: 'https://www.linkedin.com/in/danishxvi',
    email: 'danishxvi@gmail.com',
  },
}

const JOURNEY = [
  {
    icon: GraduationCap,
    title: 'Saw the problem up close',
    body: `While working with ${DEVELOPER.context}, I watched circulars and orders move entirely through email and shared folders. Finding an old document was a small ordeal every time.`,
  },
  {
    icon: Sparkles,
    title: 'Framed a cleaner idea',
    body: 'I mapped the pain points to a simple model: one document type with a shared shape, a dynamic search, role based access, and documents that are streamed rather than exposed.',
  },
  {
    icon: Wrench,
    title: 'Built it end to end',
    body: 'From the MySQL schema and Spring Boot services to the React interface and the Docker setup, this project is a complete, self contained take on how internal document distribution should feel.',
  },
]

export default function AboutDeveloperPage() {
  const { github, linkedin, email } = DEVELOPER.links

  return (
    <div className="animate-fade-in space-y-14 py-4">
      <SectionHeading
        eyebrow="About the developer"
        title={`Hi, I am ${DEVELOPER.name}.`}
        lead={DEVELOPER.lead}
        tint="#3182CE"
      />

      {/* Identity card and the fuller bio */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="flex flex-col items-start gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-neu bg-surface text-accent-blue shadow-neu-inset">
            <Code2 className="h-8 w-8" />
          </span>
          <div>
            <p className="text-lg font-extrabold text-ink">{DEVELOPER.name}</p>
            <p className="text-sm text-ink-muted">{DEVELOPER.role}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {github && (
              <Button size="sm" onClick={() => window.open(github, '_blank')}>
                <Github className="h-4 w-4" />
                GitHub
              </Button>
            )}
            {linkedin && (
              <Button size="sm" onClick={() => window.open(linkedin, '_blank')}>
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </Button>
            )}
            {email && (
              <Button size="sm" onClick={() => window.open(`mailto:${email}`)}>
                <Mail className="h-4 w-4" />
                Email
              </Button>
            )}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h2 className="text-base font-bold text-ink">A little about me</h2>
          <div className="mt-4 space-y-4">
            {DEVELOPER.bio.map((paragraph, i) => (
              <p key={i} className="text-sm leading-relaxed text-ink-muted">
                {paragraph}
              </p>
            ))}
          </div>
        </Card>
      </div>

      {/* The journey */}
      <section>
        <h2 className="mb-6 text-lg font-bold text-ink">How this project came together</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {JOURNEY.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="h-full">
              <span className="grid h-11 w-11 place-items-center rounded-neu-sm bg-surface text-accent-teal shadow-neu-inset">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-4 text-base font-bold text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{body}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
