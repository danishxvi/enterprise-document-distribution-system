import { BRANCHES } from './constants'

// A believable seed set so the dashboard looks alive during demos and
// while the backend is still being wired up. Subjects are drawn from the
// kind of internal notices a transit organisation actually circulates.
const SUBJECTS = [
  ['CIRCULAR', 'Revised guidelines for annual maintenance shutdown windows'],
  ['ORDER', 'Transfer and posting of technical staff, third quarter'],
  ['NOTIFICATION', 'Scheduled power block on the eastern corridor'],
  ['CIRCULAR', 'Updated standard operating procedure for platform safety'],
  ['NOTIFICATION', 'Holiday list for the upcoming calendar year'],
  ['ORDER', 'Delegation of financial powers to divisional heads'],
  ['CIRCULAR', 'Adoption of the revised procurement policy'],
  ['NOTIFICATION', 'Fire drill and evacuation exercise across depots'],
  ['ORDER', 'Constitution of the internal grievance committee'],
  ['CIRCULAR', 'Energy conservation measures for station buildings'],
  ['NOTIFICATION', 'Temporary revision of train frequency during festival'],
  ['ORDER', 'Promotion of ministerial staff on seniority basis'],
  ['CIRCULAR', 'Cyber hygiene practices for departmental workstations'],
  ['NOTIFICATION', 'Water supply interruption at the central workshop'],
  ['ORDER', 'Renewal of annual maintenance contract for lifts and escalators'],
  ['CIRCULAR', 'Guidelines on submission of monthly progress reports'],
  ['NOTIFICATION', 'Revised visitor entry protocol at headquarters'],
  ['ORDER', 'Deputation of officers for the safety audit programme'],
  ['CIRCULAR', 'Framework for handling public grievances within timelines'],
  ['NOTIFICATION', 'Server migration and expected downtime window'],
  ['ORDER', 'Sanction of overtime allowance for shift operators'],
  ['CIRCULAR', 'Revised dress code and identity card policy'],
  ['NOTIFICATION', 'Track renewal work affecting weekend services'],
  ['ORDER', 'Appointment of nodal officers for the inspection drive'],
]

function daysAgo(n) {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

// Deterministic seed so the list order and ids stay stable between reloads.
export const MOCK_DOCUMENTS = SUBJECTS.map(([docType, subject], index) => {
  const branch = BRANCHES[index % BRANCHES.length]
  return {
    id: index + 1,
    subject,
    docType,
    branchId: branch.id,
    branchName: branch.name,
    branchCode: branch.code,
    issueDate: daysAgo(index * 4 + 1),
    filePath: `seed/${docType.toLowerCase()}-${index + 1}.pdf`,
    fileName: `${branch.code}-${docType}-${index + 1}.pdf`,
    isActive: true,
  }
})

// Two accounts that map to the two roles the portal understands.
export const MOCK_USERS = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@edds.local',
    password: 'admin123',
    role: 'ADMIN',
  },
  {
    id: 2,
    name: 'Employee User',
    email: 'employee@edds.local',
    password: 'employee123',
    role: 'EMPLOYEE',
  },
]
