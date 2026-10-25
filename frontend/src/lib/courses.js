// Single list of courses used by the Home page, Subjects page and App header.
// hasData = true means syllabus data exists in the database for this course.
// departments and semesters for the courses marked "placeholder" are assumptions:
// update them when the real course structure is available.

export const courses = {
  Diploma: {
    label: "Diploma Engineering",
    short: "Diploma",
    hasData: true,
    departments: [
      "Information Technology",
      "Computer Engineering",
      "Electrical Engineering",
      "Civil Engineering",
      "Mechanical Engineering",
      "Chemical Engineering",
      "Plastic Engineering"
    ],
    semesters: 6
  },
  "Diploma in Architecture": {
    label: "Diploma in Architecture",
    short: "D.Arch",
    hasData: false,
    departments: ["Architecture"], // placeholder
    semesters: 6 // placeholder
  },
  "Diploma in Pharmacy": {
    label: "Diploma in Pharmacy",
    short: "D.Pharm",
    hasData: false,
    departments: ["Pharmacy"], // placeholder
    semesters: 4 // placeholder
  },
  "Diploma in Vocation": {
    label: "Diploma in Vocation",
    short: "D.Voc",
    hasData: false,
    departments: ["Vocational Studies"], // placeholder
    semesters: 4 // placeholder
  },
  "Bachelor of Engineering": {
    label: "Bachelor of Engineering",
    short: "B.E.",
    hasData: false,
    departments: ["All Branches"], // placeholder
    semesters: 8 // placeholder
  },
  "B.Arch": {
    label: "Bachelor of Architecture",
    short: "B.Arch",
    hasData: false,
    departments: ["Architecture"],
    semesters: 10
  },
  "Bachelor of Planning": {
    label: "Bachelor of Planning",
    short: "B.Plan",
    hasData: false,
    departments: ["Planning"], // placeholder
    semesters: 8 // placeholder
  },
  "Bachelor of Design": {
    label: "Bachelor of Design",
    short: "B.Des",
    hasData: false,
    departments: ["Design"], // placeholder
    semesters: 8 // placeholder
  },
  "Bachelor of Vocation": {
    label: "Bachelor of Vocation",
    short: "B.Voc",
    hasData: false,
    departments: ["Vocational Studies"], // placeholder
    semesters: 6 // placeholder
  },
  BBA: {
    label: "BBA",
    short: "BBA",
    hasData: false,
    departments: ["Business Administration"],
    semesters: 6
  },
  BCA: {
    label: "BCA",
    short: "BCA",
    hasData: false,
    departments: ["Computer Applications"],
    semesters: 6
  }
}

export const DEFAULT_COURSE = "Diploma"