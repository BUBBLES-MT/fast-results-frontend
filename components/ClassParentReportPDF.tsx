// app/components/ClassParentReportPDF.tsx

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 10,
        flexDirection: 'column',
    },
    header: {
        textAlign: 'center',
        marginBottom: 10,
    },
    headerText: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    studentInfo: {
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 9,
        fontWeight: 'bold',
        gap: 20,
    },
    studentInfoText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    tableContainer: {
        alignItems: 'center',
        marginHorizontal: 15,
    },
    table: {
        width: '95%',
        marginBottom: 4,
        borderWidth: 0.5,
        borderColor: '#000',
        borderStyle: 'solid',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 0.5,
        borderBottomColor: '#000',
        minHeight: 18,
    },
    tableHeader: {
        backgroundColor: '#e0e0e0',
        fontWeight: 'bold',
    },
    tableCell: {
        padding: 4,
        borderRightWidth: 0.5,
        borderRightColor: '#000',
        textAlign: 'center',
        fontSize: 7,
    },
    tableCellLeft: {
        padding: 4,
        borderRightWidth: 0.5,
        borderRightColor: '#000',
        textAlign: 'left',
        fontSize: 7,
    },
    lastCell: {
        borderRightWidth: 0,
    },
    // 🔥 CONTAINER YA MANENO YOTE - ina margin sawa na table
    contentContainer: {
        marginHorizontal: 15,
        width: '95%',
    },
    footer: {
        marginTop: 4,
        fontSize: 10,
        lineHeight: 1.8,
        marginBottom: 4,
    },
    boldText: {
        fontWeight: 'bold',
    },
    remarks: {
        marginTop: 6,
        fontSize: 10,
        lineHeight: 1.8,
        marginBottom: 4,
    },
    separator: {
        marginVertical: 8,
        textAlign: 'center',
    },
    parentSection: {
        marginTop: 6,
        fontSize: 9,
        lineHeight: 1.5,
    },
    signatureLine: {
        marginTop: 3,
        fontSize: 8,
    },
    cutLine: {
        textAlign: 'center',
        fontSize: 12,
        marginVertical: 8,
        fontWeight: 'bold',
        letterSpacing: 3,
    },
});

const columnWidths = {
    subject: { flex: 1.2 },
    score: { flex: 0.5 },
    grade: { flex: 0.4 },
    jumla: { flex: 0.5 },
    wastani: { flex: 0.5 },
    nafasi: { flex: 0.4 },
    namba: { flex: 0.45 },
    tabia: { flex: 1.2 },
    daraja: { flex: 0.4 },
};

interface SubjectData {
    name: string;
    a_score: number | null;
    b_score: number | null;
    jumla: string;
    avg: string;
    final_grade: string;
    position?: number;
}

interface StudentData {
    id: number;
    name: string;
    kidato: string;
    term: string;
    year: number;
    subjects: SubjectData[];
    division: string;
    points: number;
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

const getStandardGrade = (score: number | null): string => {
    if (!score) return '';
    if (score >= 75) return 'A';
    if (score >= 65) return 'B';
    if (score >= 45) return 'C';
    if (score >= 30) return 'D';
    return 'F';
};

const getBehaviourGrade = (avgScore: string): string => {
    const avg = parseFloat(avgScore);
    if (isNaN(avg)) return '';
    if (avg >= 65) return 'A';
    if (avg >= 45) return 'B';
    return 'C';
};

const behaviourItems = [
    "Bidii na Maarifa", "Ari ya kazi", "Ubora wa kazi", "Utunzaji wa vifaa",
    "Ushirikiano na wenzake", "Heshima kwa wote", "Uongozi", "Utii na Kujituma",
    "Usafi binafsi", "Utamaduni na michezo", "Uaminifu na kujiamini", "Mahudhurio shuleni"
];

const StudentReportPage = ({ data, classData }: { data: StudentData; classData: ClassData }) => {
    const rows = [];
    const maxSubjects = data.subjects.length;
    
    for (let i = 0; i < behaviourItems.length; i++) {
        const row: any = {};
        
        if (i < maxSubjects) {
            const subj = data.subjects[i];
            const avgScore = parseFloat(subj.avg);
            
            row.subject = {
                name: subj.name,
                a_score: subj.a_score,
                b_score: subj.b_score,
                jumla: subj.jumla,
                avg: subj.avg,
                final_grade: getStandardGrade(avgScore),
                position: subj.position || '',
                last_grade: getBehaviourGrade(subj.avg)
            };
        }
        
        row.behaviour = {
            code: 901 + i,
            name: behaviourItems[i]
        };
        
        rows.push(row);
    }
    
    const isPassed = data.division === "I" || data.division === "II" || data.division === "III" || data.division === "IV";
    const passStatus = isPassed ? "AMEFAULU" : "HAJAFAULU";
    
    return (
        <Page size="A4" orientation="portrait" style={styles.page}>
            <View style={styles.header}>
                <Text style={styles.headerText}>JAMHURI YA MUUNGANO WA TANZANIA</Text>
                <Text style={styles.headerText}>OFISI YA RAIS TAMISEMI</Text>
                <Text style={styles.headerText}>HALMASHAURI YA WILAYA YA {classData.district_name || "_________________________"}</Text>
                <Text style={styles.headerText}>{classData.school_name.toUpperCase()}</Text>
                <Text style={styles.headerText}>TAARIFA YA MAENDELEO YA MWANAFUNZI (TAALUMA, KAZI, TABIA NA MWENENDO)</Text>
            </View>

            <View style={styles.studentInfo}>
                <Text style={styles.studentInfoText}>JINA LA MWANAFUNZI: {data.name}</Text>
                <Text style={styles.studentInfoText}>KIDATO: {data.kidato}</Text>
                <Text style={styles.studentInfoText}>MUHULA WA: {data.term}</Text>
                <Text style={styles.studentInfoText}>MWAKA: {data.year}</Text>
            </View>

            {/* TABLE */}
            <View style={styles.tableContainer}>
                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={[styles.tableCellLeft, columnWidths.subject]}>MASOMO</Text>
                        <Text style={[styles.tableCell, columnWidths.score]}>MAJARIBIO</Text>
                        <Text style={[styles.tableCell, columnWidths.grade]}>DARAJA</Text>
                        <Text style={[styles.tableCell, columnWidths.score]}>MITIHANI</Text>
                        <Text style={[styles.tableCell, columnWidths.grade]}>DARAJA</Text>
                        <Text style={[styles.tableCell, columnWidths.jumla]}>JUMLA</Text>
                        <Text style={[styles.tableCell, columnWidths.wastani]}>WASTANI</Text>
                        <Text style={[styles.tableCell, columnWidths.grade]}>DARAJA</Text>
                        <Text style={[styles.tableCell, columnWidths.nafasi]}>NAFASI</Text>
                        <Text style={[styles.tableCell, columnWidths.namba]}>NAMBA</Text>
                        <Text style={[styles.tableCellLeft, columnWidths.tabia]}>TABIA &amp; MWENENDO</Text>
                        <Text style={[styles.tableCell, columnWidths.daraja, styles.lastCell]}>DARAJA</Text>
                    </View>

                    {rows.map((row, idx) => (
                        <View key={idx} style={styles.tableRow}>
                            {row.subject ? (
                                <Text style={[styles.tableCellLeft, columnWidths.subject]}>{row.subject.name}</Text>
                            ) : (
                                <Text style={[styles.tableCellLeft, columnWidths.subject]}></Text>
                            )}
                            
                            {row.subject ? (
                                <Text style={[styles.tableCell, columnWidths.score]}>{row.subject.a_score || ''}</Text>
                            ) : (
                                <Text style={[styles.tableCell, columnWidths.score]}></Text>
                            )}
                            
                            {row.subject ? (
                                <Text style={[styles.tableCell, columnWidths.grade]}>{getStandardGrade(row.subject.a_score)}</Text>
                            ) : (
                                <Text style={[styles.tableCell, columnWidths.grade]}></Text>
                            )}
                            
                            {row.subject ? (
                                <Text style={[styles.tableCell, columnWidths.score]}>{row.subject.b_score || ''}</Text>
                            ) : (
                                <Text style={[styles.tableCell, columnWidths.score]}></Text>
                            )}
                            
                            {row.subject ? (
                                <Text style={[styles.tableCell, columnWidths.grade]}>{getStandardGrade(row.subject.b_score)}</Text>
                            ) : (
                                <Text style={[styles.tableCell, columnWidths.grade]}></Text>
                            )}
                            
                            {row.subject ? (
                                <Text style={[styles.tableCell, columnWidths.jumla]}>{row.subject.jumla}</Text>
                            ) : (
                                <Text style={[styles.tableCell, columnWidths.jumla]}></Text>
                            )}
                            
                            {row.subject ? (
                                <Text style={[styles.tableCell, columnWidths.wastani]}>{row.subject.avg}</Text>
                            ) : (
                                <Text style={[styles.tableCell, columnWidths.wastani]}></Text>
                            )}
                            
                            {row.subject ? (
                                <Text style={[styles.tableCell, columnWidths.grade]}>{row.subject.final_grade}</Text>
                            ) : (
                                <Text style={[styles.tableCell, columnWidths.grade]}></Text>
                            )}
                            
                            {row.subject ? (
                                <Text style={[styles.tableCell, columnWidths.nafasi]}>{row.subject.position}</Text>
                            ) : (
                                <Text style={[styles.tableCell, columnWidths.nafasi]}></Text>
                            )}
                            
                            <Text style={[styles.tableCell, columnWidths.namba]}>{row.behaviour.code}</Text>
                            
                            <Text style={[styles.tableCellLeft, columnWidths.tabia]}>{row.behaviour.name}</Text>
                            
                            {row.subject ? (
                                <Text style={[styles.tableCell, columnWidths.daraja, styles.lastCell]}>{row.subject.last_grade}</Text>
                            ) : (
                                <Text style={[styles.tableCell, columnWidths.daraja, styles.lastCell]}></Text>
                            )}
                        </View>
                    ))}
                </View>
            </View>

            {/* 🔥 MANENO YOTE YANAYOFUATA - YANA MARGIN SAWA NA TABLE */}
            <View style={styles.contentContainer}>
                <View style={styles.footer}>
                    <Text>
                        Daraja la ufaulu: <Text style={styles.boldText}>{data.division}</Text> &nbsp;&nbsp;&nbsp; 
                        Point: <Text style={styles.boldText}>{data.points}</Text> &nbsp;&nbsp;&nbsp; 
                        Wastani: <Text style={styles.boldText}>{data.average.toFixed(2)}</Text> &nbsp;&nbsp;&nbsp; 
                        Nafasi yake ni: <Text style={styles.boldText}>{data.position}</Text> kati ya <Text style={styles.boldText}>{data.total_students}</Text>. 
                        <Text style={styles.boldText}> {passStatus}</Text>
                    </Text>
                    <Text>TAFSIRI YA MADARAJA: (A: 100–75 = Vizuri sana), (B: 74–65 = Vizuri), (C: 64–45 = Wastani), (D: 44–30 = Dhaifu), (F: 29–0 = Feli).</Text>
                    <Text>Madaraja I = 7–17, II = 18–21, III = 22–25, IV = 26–33, 0 = 34–35.</Text>
                </View>

                <Text style={{ marginTop: 2, marginBottom: 2 }}>
                    A. Shule imefungwa tarehe: <Text style={styles.boldText}>{classData.closing_date}</Text> &nbsp;&nbsp;&nbsp; 
                    Itafunguliwa tarehe: <Text style={styles.boldText}>{classData.opening_date}</Text>
                </Text>

                <View style={styles.remarks}>
                    <Text>B. Maoni ya mwalimu wa darasa kuhusu masomo na tabia:</Text>
                    <Text>{data.teacher_remarks}</Text>
                    <Text style={styles.signatureLine}>Tarehe: {classData.teacher_date} &nbsp;&nbsp;&nbsp; Sahihi: ________________________ &nbsp;&nbsp;&nbsp; (Jina: {classData.teacher_name})</Text>
                </View>

                <View style={styles.remarks}>
                    <Text>C. Maoni ya Mkuu wa Shule:</Text>
                    <Text>{data.headmaster_remarks}</Text>
                    <Text style={styles.signatureLine}>Tarehe: {classData.headmaster_date} &nbsp;&nbsp;&nbsp; Sahihi: ________________________ &nbsp;&nbsp;&nbsp; (Jina: {classData.headmaster_name})</Text>
                </View>

                <Text style={styles.separator}>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</Text>

                <Text style={styles.cutLine}>• • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •</Text>

                <View style={styles.parentSection}>
                    <Text>D. MAONI YA MZAZI/MLEZI KUHUSU MWANAO (IRUDISHWE SHULENI BAADA YA KUJAZA MAONI YAKO KUHUSU MAENDELEO YA MWANAO</Text>
                    <Text>KITAALUMA, KITABIA NA KUKIRI KUPOKEA TAARIFA HII:</Text>
                    <Text>....................................................................................................................................................................................................................</Text>
                    <Text>.......................................................................................................................................................................................................................</Text>
                    <Text>...........................................................................................................................................................................................................................</Text>
                    <Text>JINA LA MZAZI/MLEZI: ___________________________________&nbsp;&nbsp;&nbsp; Sahihi: ________________ &nbsp;&nbsp;&nbsp; Tarehe: __________________</Text>
                </View>
            </View>
        </Page>
    );
};

export const ClassParentReportPDF = ({ data }: { data: ClassData }) => (
    <Document>
        {data.students.map((student, index) => (
            <StudentReportPage key={student.id} data={student} classData={data} />
        ))}
    </Document>
);