// components/PrimarySingleStudentReportPDF.tsx
// 🔥 HII NI KWA MWANAFUNZI MMOJA - IMESAHIHISHWA!

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 15,
        fontSize: 9,
        flexDirection: 'column',
        fontFamily: 'Helvetica',
    },
    header: {
        textAlign: 'center',
        marginBottom: 6,
    },
    headerText: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    schoolNameText: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    studentInfo: {
        marginBottom: 6,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 9,
        fontWeight: 'bold',
        gap: 15,
        flexWrap: 'wrap',
    },
    studentInfoText: {
        fontSize: 9,
        fontWeight: 'bold',
    },
    tableContainer: {
        alignItems: 'center',
        marginHorizontal: 5,
    },
    table: {
        width: '100%',
        marginBottom: 4,
        borderWidth: 0.5,
        borderColor: '#000',
        borderStyle: 'solid',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#000',
        minHeight: 16,
    },
    tableHeader: {
        backgroundColor: '#e0e0e0',
        fontWeight: 'bold',
    },
    tableCell: {
        padding: 2,
        borderRightWidth: 0.5,
        borderRightColor: '#000',
        textAlign: 'center',
        fontSize: 7,
    },
    tableCellLeft: {
        padding: 2,
        borderRightWidth: 0.5,
        borderRightColor: '#000',
        textAlign: 'left',
        fontSize: 7,
    },
    lastCell: {
        borderRightWidth: 0,
    },
    contentContainer: {
        marginHorizontal: 5,
        width: '100%',
    },
    footer: {
        marginTop: 4,
        fontSize: 10,
        lineHeight: 1.6,
        marginBottom: 4,
    },
    boldText: {
        fontWeight: 'bold',
    },
    remarks: {
        marginTop: 4,
        fontSize: 10,
        lineHeight: 1.8,
        marginBottom: 4,
    },
    separator: {
        marginVertical: 4,
        textAlign: 'center',
    },
    parentSection: {
        marginTop: 4,
        fontSize: 10,
        lineHeight: 1.6,
    },
    signatureLine: {
        marginTop: 3,
        fontSize: 10,
    },
    cutLine: {
        textAlign: 'center',
        fontSize: 10,
        marginVertical: 4,
        fontWeight: 'bold',
        letterSpacing: 3,
    },
});

const columnWidths = {
    subject: { flex: 1.1 },
    jaribio: { flex: 0.6 },
    daraja_j: { flex: 0.45 },
    mitihani: { flex: 0.6 },
    daraja_m: { flex: 0.45 },
    jumla: { flex: 0.6 },
    wastani: { flex: 0.6 },
    daraja_w: { flex: 0.45 },
    nafasi: { flex: 0.5 },
};

// 🔥 PRIMARY GRADING - 0-50 SCALE
const getPrimaryGrade = (score: number | null): string => {
    if (score === null || score === undefined || score === 0) return '';
    if (score >= 41) return 'A';
    if (score >= 31) return 'B';
    if (score >= 21) return 'C';
    if (score >= 11) return 'D';
    return 'E';
};

const getGradeDescription = (grade: string): string => {
    switch (grade) {
        case 'A': return 'Bora Sana (41-50)';
        case 'B': return 'Nzuri (31-40)';
        case 'C': return 'Wastani (21-30)';
        case 'D': return 'Inaridhisha (11-20)';
        case 'E': return 'Haijaridhisha (0-10)';
        default: return '';
    }
};

const getPrimaryRemarks = (grade: string, average: number): string => {
    if (grade === 'A') {
        return `Amefanya vizuri sana! Wastani ${average.toFixed(1)}%. Endelea kusoma kwa bidii.`;
    } else if (grade === 'B') {
        return `Amefanya vizuri. Wastani ${average.toFixed(1)}%. Anaweza kufanya vizuri zaidi.`;
    } else if (grade === 'C') {
        return `Wastani wa kuridhisha. Wastani ${average.toFixed(1)}%. Anahitaji kuongeza juhudi.`;
    } else if (grade === 'D') {
        return `Inaridhisha. Wastani ${average.toFixed(1)}%. Anahitaji msaada zaidi.`;
    } else {
        return `Haijaridhisha. Wastani ${average.toFixed(1)}%. Anahitaji msaada wa haraka.`;
    }
};

const getHeadmasterRemarks = (grade: string, average: number): string => {
    if (grade === 'A') {
        return `Hongera kwa utendaji bora. Mtoto ana uwezo mkubwa. Wastani ${average.toFixed(1)}%.`;
    } else if (grade === 'B') {
        return `Utendaji mzuri. Tunamshauri kuongeza bidii zaidi. Wastani ${average.toFixed(1)}%.`;
    } else if (grade === 'C') {
        return `Wastani wa kuridhisha. Tunamshauri kufanya marudio makini. Wastani ${average.toFixed(1)}%.`;
    } else if (grade === 'D') {
        return `Haijatosheleza. Tunawashauri wazazi kufuatilia kwa karibu. Wastani ${average.toFixed(1)}%.`;
    } else {
        return `Haijaridhisha. Tunatoa wito kwa mzazi kushirikiana na shule. Wastani ${average.toFixed(1)}%.`;
    }
};

export const PrimarySingleStudentReportPDF = ({ data }: { data: any }) => {
    // 🔥 ERROR HANDLING
    if (!data) {
        return (
            <Document>
                <Page size="A4" orientation="portrait" style={styles.page}>
                    <Text style={{ textAlign: 'center', marginTop: 50, fontSize: 14 }}>
                        ⚠️ Hakuna data iliyopokelewa.
                    </Text>
                </Page>
            </Document>
        );
    }

    // 🔥🔥🔥 CHUKUA STUDENT DATA 🔥🔥🔥
    let studentData = null;
    let classData: any = {};

    // ✅ IKIWA NI DATA KAMA CLASS (ina "students" array)
    if (data.students && data.students.length > 0) {
        studentData = data.students[0];
        classData = {
            class_name: data.class_name || studentData?.kidato || "Darasa",
            school_name: data.school_name || studentData?.school_name || "",
            term: data.term || "I",
            year: data.year || 2026,
            district_name: data.district_name || studentData?.district_name || "",
            closing_date: data.closing_date || studentData?.closing_date || "",
            opening_date: data.opening_date || studentData?.opening_date || "",
            teacher_date: data.teacher_date || studentData?.teacher_date || "",
            headmaster_date: data.headmaster_date || studentData?.headmaster_date || "",
            teacher_name: data.teacher_name || studentData?.teacher_name || "",
            headmaster_name: data.headmaster_name || studentData?.headmaster_name || "",
        };
    }
    // ✅ IKIWA NI DATA YA STUDENT MM OJA (ina "student" object)
    else if (data.student) {
        studentData = data.student;
        classData = {
            class_name: studentData?.class_name || studentData?.darasa || "Darasa",
            school_name: data.school_name || studentData?.school_name || "",
            term: data.term || "I",
            year: data.year || 2026,
            district_name: data.district_name || studentData?.district_name || "",
            closing_date: data.closing_date || "",
            opening_date: data.opening_date || "",
            teacher_date: data.teacher_date || "",
            headmaster_date: data.headmaster_date || "",
            teacher_name: data.teacher_name || "",
            headmaster_name: data.headmaster_name || "",
        };
    }
    // ✅ IKIWA NI DATA YA STUDENT MM OJA (muundo mwingine)
    else if (data.id) {
        studentData = data;
        classData = {
            class_name: data.darasa || data.class_name || data.kidato || "Darasa",
            school_name: data.school_name || "",
            term: data.term || "I",
            year: data.year || 2026,
            district_name: data.district_name || "",
            closing_date: data.closing_date || "",
            opening_date: data.opening_date || "",
            teacher_date: data.teacher_date || "",
            headmaster_date: data.headmaster_date || "",
            teacher_name: data.teacher_name || "",
            headmaster_name: data.headmaster_name || "",
        };
    }

    // 🔥 CHECK KAMA STUDENT INATOKEA
    if (!studentData) {
        return (
            <Document>
                <Page size="A4" orientation="portrait" style={styles.page}>
                    <Text style={{ textAlign: 'center', marginTop: 50, fontSize: 14 }}>
                        ⚠️ Hakuna data ya mwanafunzi.
                    </Text>
                </Page>
            </Document>
        );
    }

    // 🔥 CHECK KAMA SUBJECTS ZIPO
    const subjects = studentData.subjects || [];
    if (!subjects || subjects.length === 0) {
        return (
            <Document>
                <Page size="A4" orientation="portrait" style={styles.page}>
                    <Text style={{ textAlign: 'center', marginTop: 50, fontSize: 14 }}>
                        ⚠️ Hakuna masomo yaliyopatikana kwa mwanafunzi huyu.
                    </Text>
                    <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 12 }}>
                        Jina: {studentData.name || 'Mwanafunzi'} | Darasa: {studentData.darasa || studentData.class_name || studentData.kidato || 'N/A'}
                    </Text>
                </Page>
            </Document>
        );
    }

    // 🔥 PREPARE DATA FOR PDF
    const districtDisplay = classData.district_name || studentData.district_name || "_______________________";
    const schoolName = classData.school_name || studentData.school_name || "";
    const termDisplay = classData.term === "I" ? "MUHULA WA KWANZA" : "MUHULA WA PILI";
    const studentName = studentData.name || "Mwanafunzi";
    const className = studentData.darasa || studentData.class_name || studentData.kidato || "Darasa";
    const year = classData.year || studentData.year || 2026;

    // 🔥 CALCULATE OVERALL STATS
    let totalScore = 0;
    let validSubjects = 0;
    subjects.forEach((sub: any) => {
        if (sub.avg && parseFloat(sub.avg) > 0) {
            totalScore += parseFloat(sub.avg);
            validSubjects++;
        }
    });
    const avgScore = validSubjects > 0 ? totalScore / validSubjects : 0;
    const overallGrade = studentData.division || studentData.grade || getPrimaryGrade(avgScore);
    const gradeDescription = getGradeDescription(overallGrade);
    const isPassed = overallGrade === "A" || overallGrade === "B" || overallGrade === "C" || overallGrade === "D";
    const passStatus = isPassed ? "AMEFAULU" : "HAJAFAULU";

    const teacherRemarks = studentData.teacher_remarks || getPrimaryRemarks(overallGrade, avgScore);
    const headmasterRemarks = studentData.headmaster_remarks || getHeadmasterRemarks(overallGrade, avgScore);

    const position = studentData.position || 0;
    const totalStudents = studentData.total_students || 0;

    // 🔥 CHUKUA TAREHE KUTOKA CLASSDATA AU STUDENTDATA
    const closingDate = classData.closing_date || studentData.closing_date || '________';
    const openingDate = classData.opening_date || studentData.opening_date || '________';
    const teacherDate = classData.teacher_date || studentData.teacher_date || '________';
    const headmasterDate = classData.headmaster_date || studentData.headmaster_date || '________';
    const teacherName = classData.teacher_name || studentData.teacher_name || '________';
    const headmasterName = classData.headmaster_name || studentData.headmaster_name || '________';

    return (
        <Document>
            <Page size="A4" orientation="portrait" style={styles.page}>
                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.headerText}>JAMHURI YA MUUNGANO WA TANZANIA</Text>
                    <Text style={styles.headerText}>OFISI YA RAIS</Text>
                    <Text style={styles.headerText}>TAWALA ZA MIKOA NA SERIKALI ZA MITAA</Text>
                    <Text style={styles.headerText}>HALMASHAURI YA WILAYA YA {districtDisplay}</Text>
                    <Text style={styles.schoolNameText}>{schoolName.toUpperCase()}</Text>
                    <Text style={styles.headerText}>TAARIFA YA MAENDELEO YA MWANAFUNZI KITAALUMA</Text>
                </View>

                {/* STUDENT INFO */}
                <View style={styles.studentInfo}>
                    <Text style={styles.studentInfoText}>JINA: {studentName}</Text>
                    <Text style={styles.studentInfoText}>DARASA: {className}</Text>
                    <Text style={styles.studentInfoText}>MUHULA: {termDisplay}</Text>
                    <Text style={styles.studentInfoText}>MWAKA: {year}</Text>
                </View>

                {/* TABLE */}
                <View style={styles.tableContainer}>
                    <View style={styles.table}>
                        {/* Table Header */}
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={[styles.tableCellLeft, columnWidths.subject, { fontSize: 8 }]}>MASOMO</Text>
                            <Text style={[styles.tableCell, columnWidths.jaribio, { fontSize: 8 }]}>JARIBIO</Text>
                            <Text style={[styles.tableCell, columnWidths.daraja_j, { fontSize: 8 }]}>DARAJA</Text>
                            <Text style={[styles.tableCell, columnWidths.mitihani, { fontSize: 8 }]}>MITIHANI</Text>
                            <Text style={[styles.tableCell, columnWidths.daraja_m, { fontSize: 8 }]}>DARAJA</Text>
                            <Text style={[styles.tableCell, columnWidths.jumla, { fontSize: 8 }]}>JUMLA</Text>
                            <Text style={[styles.tableCell, columnWidths.wastani, { fontSize: 8 }]}>WASTANI</Text>
                            <Text style={[styles.tableCell, columnWidths.daraja_w, { fontSize: 8 }]}>DARAJA</Text>
                            <Text style={[styles.tableCell, columnWidths.nafasi, { ...styles.lastCell, fontSize: 8 }]}>NAFASI</Text>
                        </View>

                        {/* Subject Rows */}
                        {subjects.map((sub: any, index: number) => {
                            const aScore = sub.a_score;
                            const bScore = sub.b_score;
                            const avgScore = sub.avg ? parseFloat(sub.avg) : null;
                            const grade = sub.final_grade || getPrimaryGrade(avgScore);
                            const position = sub.position || '';

                            return (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={[styles.tableCellLeft, columnWidths.subject]}>{sub.name}</Text>
                                    <Text style={[styles.tableCell, columnWidths.jaribio]}>
                                        {aScore !== null && aScore !== undefined ? aScore.toFixed(1) : '-'}
                                    </Text>
                                    <Text style={[styles.tableCell, columnWidths.daraja_j]}>
                                        {aScore !== null && aScore !== undefined ? getPrimaryGrade(aScore) : '-'}
                                    </Text>
                                    <Text style={[styles.tableCell, columnWidths.mitihani]}>
                                        {bScore !== null && bScore !== undefined ? bScore.toFixed(1) : '-'}
                                    </Text>
                                    <Text style={[styles.tableCell, columnWidths.daraja_m]}>
                                        {bScore !== null && bScore !== undefined ? getPrimaryGrade(bScore) : '-'}
                                    </Text>
                                    <Text style={[styles.tableCell, columnWidths.jumla]}>
                                        {sub.jumla || '-'}
                                    </Text>
                                    <Text style={[styles.tableCell, columnWidths.wastani]}>
                                        {avgScore !== null ? avgScore.toFixed(1) : '-'}
                                    </Text>
                                    <Text style={[styles.tableCell, columnWidths.daraja_w]}>
                                        {grade || '-'}
                                    </Text>
                                    <Text style={[styles.tableCell, columnWidths.nafasi, styles.lastCell]}>
                                        {position || '-'}
                                    </Text>
                                </View>
                            );
                        })}

                        {/* Summary Row */}
                        <View style={[styles.tableRow, { backgroundColor: '#f3f4f6', fontWeight: 'bold' }]}>
                            <Text style={[styles.tableCellLeft, columnWidths.subject, { fontWeight: 'bold', fontSize: 8 }]}>WASTANI WA JUMLA</Text>
                            <Text style={[styles.tableCell, columnWidths.jaribio, { fontWeight: 'bold' }]}>-</Text>
                            <Text style={[styles.tableCell, columnWidths.daraja_j, { fontWeight: 'bold' }]}>-</Text>
                            <Text style={[styles.tableCell, columnWidths.mitihani, { fontWeight: 'bold' }]}>-</Text>
                            <Text style={[styles.tableCell, columnWidths.daraja_m, { fontWeight: 'bold' }]}>-</Text>
                            <Text style={[styles.tableCell, columnWidths.jumla, { fontWeight: 'bold' }]}>-</Text>
                            <Text style={[styles.tableCell, columnWidths.wastani, { fontWeight: 'bold' }]}>
                                {avgScore.toFixed(1)}
                            </Text>
                            <Text style={[styles.tableCell, columnWidths.daraja_w, { fontWeight: 'bold' }]}>
                                {overallGrade}
                            </Text>
                            <Text style={[styles.tableCell, columnWidths.nafasi, { ...styles.lastCell, fontWeight: 'bold' }]}>
                                {position}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* SUMMARY */}
                <View style={styles.contentContainer}>
                    <View style={styles.footer}>
                        <Text>
                            WASTANI: <Text style={styles.boldText}>{avgScore.toFixed(1)}</Text> &nbsp;&nbsp;&nbsp;
                            DARAJA: <Text style={styles.boldText}>{overallGrade}</Text> ({gradeDescription}) &nbsp;&nbsp;&nbsp;
                            NAFASI: <Text style={styles.boldText}>{position}</Text> kati ya {totalStudents} &nbsp;&nbsp;&nbsp;
                            HALI: <Text style={styles.boldText}>{passStatus}</Text>
                        </Text>
                        <Text style={{ marginTop: 2, fontSize: 10 }}>
                            <Text style={styles.boldText}>TAFSIRI YA MADARAJA:</Text>
                            A = 41-50 (Bora Sana), B = 31-40 (Nzuri), C = 21-30 (Wastani), D = 11-20 (Inaridhisha), E = 0-10 (Haijaridhisha)
                        </Text>
                    </View>

                    {/* School Dates - ✅ IMESAHIHISHWA! */}
                    <Text style={{ marginTop: 4, marginBottom: 4, fontSize: 10 }}>
                        A. Shule imefungwa: <Text style={styles.boldText}>{closingDate}</Text> &nbsp;&nbsp;&nbsp; 
                        Itafunguliwa: <Text style={styles.boldText}>{openingDate}</Text>
                    </Text>

                    {/* Teacher Remarks - ✅ IMESAHIHISHWA! */}
                    <View style={styles.remarks}>
                        <Text style={styles.boldText}>B. MAONI YA MWALIMU WA DARASA:</Text>
                        <Text>{teacherRemarks}</Text>
                        <Text style={styles.signatureLine}>
                            Tarehe: {teacherDate} &nbsp;&nbsp;&nbsp; 
                            Sahihi: ________________________ &nbsp;&nbsp;&nbsp; 
                            (Jina: {teacherName})
                        </Text>
                    </View>

                    {/* Headmaster Remarks - ✅ IMESAHIHISHWA! */}
                    <View style={styles.remarks}>
                        <Text style={styles.boldText}>C. MAONI YA MWALIMU MKUU:</Text>
                        <Text>{headmasterRemarks}</Text>
                        <Text style={styles.signatureLine}>
                            Tarehe: {headmasterDate} &nbsp;&nbsp;&nbsp; 
                            Sahihi: ________________________ &nbsp;&nbsp;&nbsp; 
                            (Jina: {headmasterName})
                        </Text>
                    </View>

                    <Text style={styles.separator}>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</Text>
                    <Text style={styles.cutLine}> • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •</Text>

                    {/* Parent Section */}
                    <View style={styles.parentSection}>
                        <Text style={styles.boldText}>D. MAONI YA MZAZI/MLEZI KUHUSU MWANAO</Text>
                        <Text>(IRUDISHWE SHULENI BAADA YA KUJAZA MAONI YAKO KUHUSU MAENDELEO YA MWANAO)</Text>
                        <Text style={{ marginTop: 4 }}>......................................................................................................................................................................................................</Text>
                        <Text>......................................................................................................................................................................................................</Text>
                        <Text>......................................................................................................................................................................................................</Text>
                        <Text style={{ marginTop: 4 }}>
                            JINA LA MZAZI/MLEZI: ________________________________&nbsp;&nbsp;&nbsp; 
                            Sahihi: ______________ &nbsp;&nbsp;&nbsp; 
                            Tarehe: _________________
                        </Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default PrimarySingleStudentReportPDF;