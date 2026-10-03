import { Code2, Github, GraduationCap, Linkedin, Mail, Sparkles, Wrench } from 'lucide-react'
import Card from '../components/ui/Card'
import { buttonClasses } from '../components/ui/Button'
import Container from '../components/layout/Container'
import PageHero from '../components/layout/PageHero'

// -----------------------------------------------------------------------------
// Edit this block to personalise the page. Everything the page renders is
// driven from here, so there is no need to touch the markup below.
// -----------------------------------------------------------------------------
const DEVELOPER = {
  name: 'Danish Husain',
  role: 'Software developer',
  // Set this to the exact organisation name if you want it shown publicly.
  // It is left generic by default to keep the internal project unattributed.
  context: 'a large public transit organisation',
  lead:
    'A software developer who enjoys turning real world processes into clean, dependable software, from the API and the tests all the way to the deployment.',
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
    <div className="pb-20">
      <PageHero overlap eyebrow="About the developer" title={`Hi, I am ${DEVELOPER.name}.`} lead={DEVELOPER.lead} />

      <Container className="relative -mt-16 space-y-16">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="flex flex-col items-start gap-5 shadow-card">
            <span className="icon-tile h-16 w-16 bg-brand-500 text-white">
              <Code2 className="h-8 w-8" />
            </span>
            <div>
              <p className="text-xl font-extrabold text-brand-900">{DEVELOPER.name}</p>
              <p className="text-sm font-semibold text-brand-500">{DEVELOPER.role}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {github && (
                <a href={github} target="_blank" rel="noreferrer" className={buttonClasses({ variant: 'secondary', size: 'sm' })}>
                  <Github className="h-4 w-4" /> GitHub
                </a>
              )}
              {linkedin && (
                <a href={linkedin} target="_blank" rel="noreferrer" className={buttonClasses({ variant: 'secondary', size: 'sm' })}>
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} className={buttonClasses({ variant: 'secondary', size: 'sm' })}>
                  <Mail className="h-4 w-4" /> Email
                </a>
              )}
            </div>
          </Card>

          <Card className="shadow-card lg:col-span-2">
            <h2 className="text-base font-bold text-brand-900">A little about me</h2>
            <div className="mt-4 space-y-4">
              {DEVELOPER.bio.map((paragraph, i) => (
                <p key={i} className="text-sm leading-relaxed text-brand-900/75">
                  {paragraph}
                </p>
              ))}
            </div>
          </Card>
        </div>

        <section>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-brand-500">The story</p>
          <h2 className="mt-3 text-2xl font-extrabold text-brand-900">How this project came together</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {JOURNEY.map(({ icon: Icon, title, body }) => (
              <Card key={title} interactive className="h-full">
                <span className="icon-tile h-11 w-11">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-bold text-brand-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-900/70">{body}</p>
              </Card>
            ))}
          </div>
        </section>
      </Container>
    </div>
  )
}
