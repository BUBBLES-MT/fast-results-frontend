// components/PrimaryParentReportPDF.tsx

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 9,
        flexDirection: 'column',
        fontFamily: 'Helvetica',
    },
    header: {
        textAlign: 'center',
        marginBottom: 8,
    },
    headerText: {
        fontSize: 11,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    schoolNameText: {
        fontSize: 13,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    studentInfo: {
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 9,
        fontWeight: 'bold',
        gap: 20,
        flexWrap: 'wrap',
    },
    studentInfoText: {
        fontSize: 9,
        fontWeight: 'bold',
    },
    tableContainer: {
        alignItems: 'center',
        marginHorizontal: 10,
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
        padding: 3,
        borderRightWidth: 0.5,
        borderRightColor: '#000',
        textAlign: 'center',
        fontSize: 7,
    },
    tableCellLeft: {
        padding: 3,
        borderRightWidth: 0.5,
        borderRightColor: '#000',
        textAlign: 'left',
        fontSize: 7,
    },
    lastCell: {
        borderRightWidth: 0,
    },
    contentContainer: {
        marginHorizontal: 10,
        width: '100%',
    },
    footer: {
        marginTop: 4,
        fontSize: 7,
        lineHeight: 1.4,
        marginBottom: 4,
    },
    boldText: {
        fontWeight: 'bold',
    },
    remarks: {
        marginTop: 4,
        fontSize: 8,
        lineHeight: 1.4,
        marginBottom: 4,
    },
    separator: {
        marginVertical: 4,
        textAlign: 'center',
    },
    parentSection: {
        marginTop: 4,
        fontSize: 8,
        lineHeight: 1.4,
    },
    signatureLine: {
        marginTop: 3,
        fontSize: 8,
    },
    cutLine: {
        textAlign: 'center',
        fontSize: 10,
        marginVertical: 4,
        fontWeight: 'bold',
        letterSpacing: 3,
    },
    gradeBadge: {
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 2,
        fontWeight: 'bold',
    },
    gradeA: { backgroundColor: '#10b981', color: '#ffffff' },
    gradeB: { backgroundColor: '#3b82f6', color: '#ffffff' },
    gradeC: { backgroundColor: '#f59e0b', color: '#ffffff' },
    gradeD: { backgroundColor: '#f97316', color: '#ffffff' },
    gradeE: { backgroundColor: '#ef4444', color: '#ffffff' },
});

const columnWidths = {
    subject: { flex: 1.8 },
    alama: { flex: 0.7 },
    daraja: { flex: 0.6 },
    position: { flex: 0.6 },
};

// 🔥 PRIMARY GRADING - 0-50 SCALE (SAHIHI!)
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

const getGradeStyle = (grade: string) => {
    switch (grade) {
        case 'A': return styles.gradeA;
        case 'B': return styles.gradeB;
        case 'C': return styles.gradeC;
        case 'D': return styles.gradeD;
        case 'E': return styles.gradeE;
        default: return {};
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
    darasa: string;
    term: string;
    year: number;
    subjects: SubjectData[];
    average: number;
    grade: string;
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

export const PrimaryParentReportPDF = ({ data }: { data: StudentData }) => {
    // 🔥🔥🔥 HAKIKISHA DATA IPO KABLA YA KUENDELEA! 🔥🔥🔥
    if (!data) {
        return (
            <Document>
                <Page size="A4" orientation="portrait" style={styles.page}>
                    <Text style={{ textAlign: 'center', marginTop: 50, fontSize: 14 }}>
                        ⚠️ Hakuna data iliyopokelewa.
                    </Text>
                    <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 12 }}>
                        Tafadhali hakikisha umechagua darasa na muhula.
                    </Text>
                </Page>
            </Document>
        );
    }

    // 🔥🔥🔥 HAKIKISHA SUBJECTS IPO NA SI EMPTY! 🔥🔥🔥
    if (!data.subjects || data.subjects.length === 0) {
        return (
            <Document>
                <Page size="A4" orientation="portrait" style={styles.page}>
                    <Text style={{ textAlign: 'center', marginTop: 50, fontSize: 14 }}>
                        ⚠️ Hakuna masomo yaliyopatikana kwa mwanafunzi huyu.
                    </Text>
                    <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 12 }}>
                        Jina: {data.name || 'Mwanafunzi'} | Darasa: {data.darasa || 'N/A'}
                    </Text>
                    <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 12 }}>
                        Tafadhali hakikisha mwanafunzi ana alama kwenye mfumo.
                    </Text>
                </Page>
            </Document>
        );
    }

    const districtDisplay = data.district_name ? data.district_name : "_______________________";
    const termDisplay = data.term === "I" ? "MUHULA WA KWANZA" : "MUHULA WA PILI";
    
    // 🔥 CALCULATE OVERALL STATS - PRIMARY
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

    // 🔥 TUMIA REMARKS KUTOKA DATA AU GENERATE AUTO
    const teacherRemarks = data.teacher_remarks || getPrimaryRemarks(overallGrade, avgScore);
    const headmasterRemarks = data.headmaster_remarks || getHeadmasterRemarks(overallGrade, avgScore);

    return (
        <Document>
            <Page size="A4" orientation="portrait" style={styles.page}>
                {/* HEADER */}
                <View style={styles.header}>
                    <Text style={styles.headerText}>JAMHURI YA MUUNGANO WA TANZANIA</Text>
                    <Text style={styles.headerText}>OFISI YA RAIS</Text>
                    <Text style={styles.headerText}>TAWALA ZA MIKOA NA SERIKALI ZA MITAA</Text>
                    <Text style={styles.headerText}>HALMASHAURI YA WILAYA YA {districtDisplay}</Text>
                    <Text style={styles.schoolNameText}>{data.school_name?.toUpperCase() || ''}</Text>
                    <Text style={styles.headerText}>TAARIFA YA MAENDELEO YA MWANAFUNZI KITAALUMA</Text>
                </View>

                {/* STUDENT INFO */}
                <View style={styles.studentInfo}>
                    <Text style={styles.studentInfoText}>JINA: {data.name}</Text>
                    <Text style={styles.studentInfoText}>DARASA: {data.darasa}</Text>
                    <Text style={styles.studentInfoText}>MUHULA: {termDisplay}</Text>
                    <Text style={styles.studentInfoText}>MWAKA: {data.year}</Text>
                </View>

                {/* TABLE - PRIMARY (HAKUNA NAMBA, TABIA, DARAJA!) */}
                <View style={styles.tableContainer}>
                    <View style={styles.table}>
                        {/* Table Header */}
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={[styles.tableCellLeft, columnWidths.subject]}>MASOMO</Text>
                            <Text style={[styles.tableCell, columnWidths.alama]}>ALAMA</Text>
                            <Text style={[styles.tableCell, columnWidths.daraja]}>DARAJA</Text>
                            <Text style={[styles.tableCell, columnWidths.position, styles.lastCell]}>NAFASI</Text>
                        </View>

                        {/* Subject Rows */}
                        {data.subjects.map((sub, index) => {
                            const score = sub.avg ? parseFloat(sub.avg) : null;
                            const grade = getPrimaryGrade(score);
                            const position = sub.position || '';

                            return (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={[styles.tableCellLeft, columnWidths.subject]}>{sub.name}</Text>
                                    <Text style={[styles.tableCell, columnWidths.alama]}>
                                        {score !== null ? `${score.toFixed(1)}` : '-'}
                                    </Text>
                                    <Text style={[styles.tableCell, columnWidths.daraja]}>
                                        {grade ? (
                                            <Text style={[getGradeStyle(grade), { paddingHorizontal: 4, paddingVertical: 1, borderRadius: 2 }]}>
                                                {grade}
                                            </Text>
                                        ) : '-'}
                                    </Text>
                                    <Text style={[styles.tableCell, columnWidths.position, styles.lastCell]}>
                                        {position || '-'}
                                    </Text>
                                </View>
                            );
                        })}

                        {/* Summary Row */}
                        <View style={[styles.tableRow, { backgroundColor: '#f3f4f6', fontWeight: 'bold' }]}>
                            <Text style={[styles.tableCellLeft, columnWidths.subject, { fontWeight: 'bold' }]}>WASTANI WA JUMLA</Text>
                            <Text style={[styles.tableCell, columnWidths.alama, { fontWeight: 'bold' }]}>
                                {avgScore.toFixed(1)}
                            </Text>
                            <Text style={[styles.tableCell, columnWidths.daraja, { fontWeight: 'bold' }]}>
                                <Text style={[getGradeStyle(overallGrade), { paddingHorizontal: 4, paddingVertical: 1, borderRadius: 2 }]}>
                                    {overallGrade}
                                </Text>
                            </Text>
                            <Text style={[styles.tableCell, columnWidths.position, styles.lastCell, { fontWeight: 'bold' }]}>
                                {data.position}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* SUMMARY */}
                <View style={styles.contentContainer}>
                    <View style={styles.footer}>
                        <Text>
                            <Text style={styles.boldText}>WASTANI: </Text>
                            {avgScore.toFixed(1)} &nbsp;&nbsp;&nbsp;
                            <Text style={styles.boldText}>DARAJA: </Text>
                            {overallGrade} ({gradeDescription}) &nbsp;&nbsp;&nbsp;
                            <Text style={styles.boldText}>NAFASI: </Text>
                            {data.position} kati ya {data.total_students} &nbsp;&nbsp;&nbsp;
                            <Text style={styles.boldText}>HALI: </Text>
                            {passStatus}
                        </Text>
                        <Text style={{ marginTop: 2 }}>
                            <Text style={styles.boldText}>TAFSIRI YA MADARAJA:</Text>
                            A = 41-50 (Bora Sana), B = 31-40 (Nzuri), C = 21-30 (Wastani), D = 11-20 (Inaridhisha), E = 0-10 (Haijaridhisha)
                        </Text>
                    </View>

                    {/* School Dates */}
                    <Text style={{ marginTop: 4, marginBottom: 4 }}>
                        A. Shule imefungwa: <Text style={styles.boldText}>{data.closing_date || '________'}</Text> &nbsp;&nbsp;&nbsp; 
                        Itafunguliwa: <Text style={styles.boldText}>{data.opening_date || '________'}</Text>
                    </Text>

                    {/* Teacher Remarks */}
                    <View style={styles.remarks}>
                        <Text style={styles.boldText}>B. MAONI YA MWALIMU WA DARASA:</Text>
                        <Text>{teacherRemarks}</Text>
                        <Text style={styles.signatureLine}>
                            Tarehe: {data.teacher_date || '________'} &nbsp;&nbsp;&nbsp; 
                            Sahihi: ________________________ &nbsp;&nbsp;&nbsp; 
                            (Jina: {data.teacher_name || '________'})
                        </Text>
                    </View>

                    {/* Headmaster Remarks */}
                    <View style={[styles.remarks, { backgroundColor: '#f0fdf4', padding: 4 }]}>
                        <Text style={styles.boldText}>C. MAONI YA MKUU WA SHULE:</Text>
                        <Text>{headmasterRemarks}</Text>
                        <Text style={styles.signatureLine}>
                            Tarehe: {data.headmaster_date || '________'} &nbsp;&nbsp;&nbsp; 
                            Sahihi: ________________________ &nbsp;&nbsp;&nbsp; 
                            (Jina: {data.headmaster_name || '________'})
                        </Text>
                    </View>

                    {/* Separator */}
                    <Text style={styles.separator}>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</Text>
                    <Text style={styles.cutLine}>• • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •</Text>

                    {/* Parent Section */}
                    <View style={styles.parentSection}>
                        <Text style={styles.boldText}>D. MAONI YA MZAZI/MLEZI KUHUSU MWANAO</Text>
                        <Text>(IRUDISHWE SHULENI BAADA YA KUJAZA MAONI YAKO KUHUSU MAENDELEO YA MWANAO)</Text>
                        <Text style={{ marginTop: 4 }}>....................................................................................................................................................................................................................</Text>
                        <Text>.......................................................................................................................................................................................................................</Text>
                        <Text>...........................................................................................................................................................................................................................</Text>
                        <Text style={{ marginTop: 4 }}>
                            JINA LA MZAZI/MLEZI: ___________________________________________ &nbsp;&nbsp;&nbsp; 
                            Sahihi: ___________________ &nbsp;&nbsp;&nbsp; 
                            Tarehe: ____________________
                        </Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default PrimaryParentReportPDF;