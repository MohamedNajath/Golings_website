import { Link } from 'react-router-dom'
import { PageHero } from '../components/ui'
import { useSeo } from '../hooks/useSeo'

type Doc = { title: string; path: string; intro: string; sections: [string, string[]][] }
const note = 'Draft for the internship application. Goalings should review this text (ideally with legal counsel) and replace anything that does not match its real policies before launch.'
const docs: Record<'privacy' | 'terms', Doc> = {
  privacy: { title: 'Privacy Policy', path: '/privacy-policy', intro: 'How Goalings handles the personal information you submit when applying to the Internship & Professional Training Program.', sections: [
    ['Information we collect', ['The details you enter in the application form: name, email, phone and WhatsApp numbers, country and city, education details, chosen program and training mode, skills and experience, optional LinkedIn, GitHub and portfolio links, your motivation statement, and the CV you upload.', 'The date and time of your submission and your consent. We store a one-way hash of your IP address and your browser’s user-agent for abuse prevention, not your raw IP address.']],
    ['How we use it', ['To review your application, contact you about next steps, and run the internship selection process.', 'To send you an acknowledgement email and to notify our team of new applications.']],
    ['Who can see it', ['Only authorized Goalings administrators who sign in to the protected admin dashboard. Your CV is stored privately and is never publicly accessible.']],
    ['Retention and your rights', ['We keep applications only as long as needed for the selection process and any legal requirements. You may ask to access, correct or delete your information by contacting us through the Contact page.']],
    ['Contact', ['Questions about this policy: use the details on the Contact page.']],
  ] },
  terms: { title: 'Terms and Conditions', path: '/terms-and-conditions', intro: 'Terms that apply when you submit an application to the Goalings Internship & Professional Training Program.', sections: [
    ['Accuracy of information', ['You confirm that the information and documents you submit are accurate and that you have the right to share them.']],
    ['No guarantee of selection or employment', ['Submitting an application does not guarantee selection. Participation, and any later employment consideration, depend on evaluation, performance, available vacancies and company requirements.']],
    ['Program terms', ['Details such as fees, stipend, working hours and start dates are confirmed by Goalings during the selection process and may change.']],
    ['Certificates', ['Completion certificates and experience letters are issued to participants who successfully complete the program and meet its requirements.']],
    ['Acceptable use', ['Do not submit false, harmful or malicious content, and do not attempt to disrupt or gain unauthorized access to the website.']],
  ] },
}
export default function LegalPage({ kind }: { kind: 'privacy' | 'terms' }) {
  const d = docs[kind]
  useSeo({ title: `${d.title} | Goalings`, description: d.intro, path: d.path })
  return (<>
    <PageHero title={d.title} text={d.intro} />
    <section className="section"><div className="wrap max-w-3xl">
      <p className="mb-8 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">{note}</p>
      {d.sections.map(([h, ps]) => <div key={h} className="mb-7"><h2 className="mb-2 text-xl font-bold text-navy">{h}</h2>{ps.map(p => <p key={p} className="mb-2 text-slate-600">{p}</p>)}</div>)}
      <Link to="/internship-training#apply" className="font-bold text-navy underline hover:text-orange">Back to the application</Link>
    </div></section></>)
}
