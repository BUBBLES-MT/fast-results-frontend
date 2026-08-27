// components/PrimaryClassParentReportPDF.tsx

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
    // 🔥 SEHEMU HIZI ZIMEONGEZEWA UKUBWA!
    footer: {
        marginTop: 4,
        fontSize: 10,  // 🔥 IMEONGEZWA
        lineHeight: 1.6,
        marginBottom: 4,
    },
    boldText: {
        fontWeight: 'bold',
    },
    remarks: {
        marginTop: 4,
        fontSize: 10,  // 🔥 IMEONGEZWA
        lineHeight: 1.8,
        marginBottom: 4,
    },
    separator: {
        marginVertical: 4,
        textAlign: 'center',
    },
    parentSection: {
        marginTop: 4,
        fontSize: 10,  // 🔥 IMEONGEZWA
        lineHeight: 1.6,
    },
    signatureLine: {
        marginTop: 3,
        fontSize: 10,  // 🔥 IMEONGEZWA
    },
    cutLine: {
        textAlign: 'center',
        fontSize: 10,
        marginVertical: 4,
        fontWeight: 'bold',
        letterSpacing: 3,
    },
});

// 🔥 COLUMN WIDTHS - 9 COLUMNS (HAZIJAGUSWA!)
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

interface SubjectData {
    name: string;
    a_score: number | null;
    b_score: number | null;
    jumla: string;
    avg: string;
    final_grade: string;
    position?: number | string;
}

interface StudentData {
    id: number;
    name: string;
    kidato: string;
    term: string;
    year: number;
    subjects: SubjectData[];
    grade: string;
    average: number;
    position: number;
    total_students: number;
    teacher_remarks: string;
    headmaster_remarks: string;
    teacher_name: string;
    headmaster_name: string;
    teacher_date: string;
    headmaster_date: string;
    closing_date: string;
    opening_date: string;
    school_name: string;
    district_name?: string;
}

interface ClassData {
    class_name: string;
    school_name: string;
    term: string;
    year: number;
    students: StudentData[];
    total_students: number;
    district_name: string;
    closing_date: string;
    opening_date: string;
    teacher_date: string;
    headmaster_date: string;
    teacher_name: string;
    headmaster_name: string;
}

const PrimaryStudentReportPage = ({ data, classData }: { data: StudentData; classData: ClassData }) => {
    const districtDisplay = classData.district_name || data.district_name || "_______________________";
    const termDisplay = data.term === "I" ? "MUHULA WA KWANZA" : "MUHULA WA PILI";
    
    // 🔥 CALCULATE OVERALL STATS
    let totalScore = 0;
    let validSubjects = 0;
    data.subjects.forEach(sub => {
        if (sub.avg && parseFloat(sub.avg) > 0) {
            totalScore += parseFloat(sub.avg);
            validSubjects++;
        }
    });
    const avgScore = validSubjects > 0 ? totalScore / validSubjects : 0;
    const overallGrade = getPrimaryGrade(avgScore);
    const gradeDescription = getGradeDescription(overallGrade);
    const isPassed = overallGrade === "A" || overallGrade === "B" || overallGrade === "C" || overallGrade === "D";
    const passStatus = isPassed ? "AMEFAULU" : "HAJAFAULU";

    const teacherRemarks = data.teacher_remarks || getPrimaryRemarks(overallGrade, avgScore);
    const headmasterRemarks = data.headmaster_remarks || getHeadmasterRemarks(overallGrade, avgScore);

    return (
        <Page size="A4" orientation="portrait" style={styles.page}>
            {/* HEADER */}
            <View style={styles.header}>
                <Text style={styles.headerText}>JAMHURI YA MUUNGANO WA TANZANIA</Text>
                <Text style={styles.headerText}>OFISI YA RAIS</Text>
                <Text style={styles.headerText}>TAWALA ZA MIKOA NA SERIKALI ZA MITAA</Text>
                <Text style={styles.headerText}>HALMASHAURI YA WILAYA YA {districtDisplay}</Text>
                <Text style={styles.schoolNameText}>{classData.school_name.toUpperCase()}</Text>
                <Text style={styles.headerText}>TAARIFA YA MAENDELEO YA MWANAFUNZI KITAALUMA</Text>
            </View>

            {/* STUDENT INFO */}
            <View style={styles.studentInfo}>
                <Text style={styles.studentInfoText}>JINA: {data.name}</Text>
                <Text style={styles.studentInfoText}>DARASA: {data.kidato}</Text>
                <Text style={styles.studentInfoText}>MUHULA: {termDisplay}</Text>
                <Text style={styles.studentInfoText}>MWAKA: {data.year}</Text>
            </View>

            {/* TABLE - PRIMARY (9 COLUMNS) - HAJAGUSWA! */}
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
                    {data.subjects.map((sub, index) => {
                        const aScore = sub.a_score;
                        const bScore = sub.b_score;
                        const avgScore = sub.avg ? parseFloat(sub.avg) : null;
                        const grade = getPrimaryGrade(avgScore);
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
                            {data.position}
                        </Text>
                    </View>
                </View>
            </View>

            {/* 🔥 SEHEMU HIZI ZIMEONGEZEWA UKUBWA! */}
            <View style={styles.contentContainer}>
                {/* Footer - IMEONGEZEWA UKUBWA */}
                <View style={styles.footer}>
                    <Text>
                        WASTANI: <Text style={styles.boldText}>{avgScore.toFixed(1)}</Text> &nbsp;&nbsp;&nbsp;
                        DARAJA: <Text style={styles.boldText}>{overallGrade}</Text> ({gradeDescription}) &nbsp;&nbsp;&nbsp;
                        NAFASI: <Text style={styles.boldText}>{data.position}</Text> kati ya {data.total_students} &nbsp;&nbsp;&nbsp;
                        HALI: <Text style={styles.boldText}>{passStatus}</Text>
                    </Text>
                    <Text style={{ marginTop: 2, fontSize: 10 }}>
                        <Text style={styles.boldText}>TAFSIRI YA MADARAJA:</Text>
                        A = 41-50 (Bora Sana), B = 31-40 (Nzuri), C = 21-30 (Wastani), D = 11-20 (Inaridhisha), E = 0-10 (Haijaridhisha)
                    </Text>
                </View>

                {/* Shule imefungwa - IMEONGEZEWA UKUBWA */}
                <Text style={{ marginTop: 4, marginBottom: 4, fontSize: 10 }}>
                    A. Shule imefungwa: <Text style={styles.boldText}>{classData.closing_date}</Text> &nbsp;&nbsp;&nbsp; 
                    Itafunguliwa: <Text style={styles.boldText}>{classData.opening_date}</Text>
                </Text>

                {/* Teacher Remarks - IMEONGEZEWA UKUBWA */}
                <View style={styles.remarks}>
                    <Text style={styles.boldText}>B. MAONI YA MWALIMU WA DARASA:</Text>
                    <Text>{teacherRemarks}</Text>
                    <Text style={styles.signatureLine}>
                        Tarehe: {classData.teacher_date} &nbsp;&nbsp;&nbsp; 
                        Sahihi: ________________________ &nbsp;&nbsp;&nbsp; 
                        (Jina: {classData.teacher_name})
                    </Text>
                </View>

                {/* Headmaster Remarks - IMEONGEZEWA UKUBWA */}
                <View style={styles.remarks}>
                    <Text style={styles.boldText}>C. MAONI YA MWALIMU MKUU:</Text>
                    <Text>{headmasterRemarks}</Text>
                    <Text style={styles.signatureLine}>
                        Tarehe: {classData.headmaster_date} &nbsp;&nbsp;&nbsp; 
                        Sahihi: ________________________ &nbsp;&nbsp;&nbsp; 
                        (Jina: {classData.headmaster_name})
                    </Text>
                </View>

                <Text style={styles.separator}>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</Text>
                <Text style={styles.cutLine}> • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •</Text>

                {/* Parent Section - IMEONGEZEWA UKUBWA */}
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
    );
};

export const PrimaryClassParentReportPDF = ({ data }: { data: ClassData }) => {
    if (!data || !data.students || data.students.length === 0) {
        return (
            <Document>
                <Page size="A4" orientation="portrait" style={styles.page}>
                    <Text style={{ textAlign: 'center', marginTop: 50, fontSize: 14 }}>
                        ⚠️ Hakuna data ya wanafunzi.
                    </Text>
                    <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 12 }}>
                        Tafadhali hakikisha umechagua darasa na muhula sahihi.
                    </Text>
                </Page>
            </Document>
        );
    }

    return (
        <Document>
            {data.students.map((student, index) => (
                <PrimaryStudentReportPage key={student.id || index} data={student} classData={data} />
            ))}
        </Document>
    );
};

export default PrimaryClassParentReportPDF;