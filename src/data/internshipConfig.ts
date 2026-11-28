// ─────────────────────────────────────────────────────────────────────────
//  EDIT ME: business policies for the internship program.
//  Anything left as '' is NOT invented on the website: visitors see a neutral
//  "will be confirmed by the Goalings team" message instead. Fill these in
//  only when the policy is confirmed.
// ─────────────────────────────────────────────────────────────────────────
export const policy = {
  stipend: '',            // e.g. 'The internship is unpaid.'  or  'Interns receive a monthly allowance of …'
  fees: '',               // e.g. 'There is no fee to apply.'
  workingHours: '',       // e.g. 'Sunday–Thursday, 4 hours per day'
  startDates: '',         // e.g. 'New batches start every quarter.'
  applicationDeadline: '',// e.g. 'Applications close on 31 January.'
  reviewTime: '',         // e.g. 'We usually reply within 10 working days.'
}
export const TBC = 'This will be confirmed by the Goalings team when your application is reviewed.'
export const SITE_URL = 'https://goalings.com'
export const MAX_CV_MB = Number(import.meta.env.VITE_MAX_CV_MB ?? 5)
