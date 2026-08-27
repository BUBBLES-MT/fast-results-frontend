// app/components/ParentReportPDF.tsx

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 20,
        fontSize: 9,
        flexDirection: 'column',
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
    studentInfo: {
        marginBottom: 8,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 9,
        fontWeight: 'bold',
        gap: 20,
    },
    studentInfoText: {
        fontSize: 9,
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
    contentContainer: {
        marginHorizontal: 15,
        width: '95%',
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
        marginTop: 6,
        fontSize: 8,
        lineHeight: 1.4,
        marginBottom: 4,
    },
    separator: {
        marginVertical: 6,
        textAlign: 'center',
    },
    parentSection: {
        marginTop: 6,
        fontSize: 8,
        lineHeight: 1.4,
    },
    signatureLine: {
        marginTop: 3,
        fontSize: 8,
    },
    cutLine: {
        textAlign: 'center',
        fontSize: 12,
        marginVertical: 6,
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

// ============================================================
// 🔥 FORMAT DATE - ONGEZA SIKU 1!
// ============================================================
const formatDate = (dateValue: any): string => {
    if (!dateValue) return "____________________________";
    
    // 🔥 KAMA NI STRING
    if (typeof dateValue === 'string') {
        // KAMA NI YYYY-MM-DD
        if (dateValue.includes('-')) {
            const parts = dateValue.split('-');
            if (parts.length === 3) {
                // 🔥 ONGEZA SIKU 1!
                const year = parseInt(parts[0]);
                const month = parseInt(parts[1]) - 1;
                const day = parseInt(parts[2]);
                const dateObj = new Date(year, month, day);
                // Ongeza siku 1
                dateObj.setDate(dateObj.getDate() + 1);
                const d = String(dateObj.getDate()).padStart(2, '0');
                const m = String(dateObj.getMonth() + 1).padStart(2, '0');
                const y = dateObj.getFullYear();
                return `${d}/${m}/${y}`;
            }
        }
        // KAMA TAYARI NI DD/MM/YYYY
        if (dateValue.includes('/')) {
            // 🔥 ONGEZA SIKU 1!
            const parts = dateValue.split('/');
            if (parts.length === 3) {
                const day = parseInt(parts[0]);
                const month = parseInt(parts[1]) - 1;
                const year = parseInt(parts[2]);
                const dateObj = new Date(year, month, day);
                dateObj.setDate(dateObj.getDate() + 1);
                const d = String(dateObj.getDate()).padStart(2, '0');
                const m = String(dateObj.getMonth() + 1).padStart(2, '0');
                const y = dateObj.getFullYear();
                return `${d}/${m}/${y}`;
            }
            return dateValue;
        }
        return dateValue;
    }
    
    // 🔥 KAMA NI DATE OBJECT
    if (dateValue instanceof Date || (dateValue && typeof dateValue === 'object' && dateValue.toDate)) {
        try {
            const d = dateValue instanceof Date ? dateValue : dateValue.toDate();
            if (!isNaN(d.getTime())) {
                // 🔥 ONGEZA SIKU 1!
                d.setDate(d.getDate() + 1);
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                return `${day}/${month}/${year}`;
            }
        } catch (e) {
            console.error("Error formatting date:", e);
        }
    }
    
    // KAMA NI NUMBER (timestamp)
    if (typeof dateValue === 'number') {
        try {
            const d = new Date(dateValue);
            if (!isNaN(d.getTime())) {
                d.setDate(d.getDate() + 1);
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                return `${day}/${month}/${year}`;
            }
        } catch (e) {
            console.error("Error formatting date from timestamp:", e);
        }
    }
    
    return String(dateValue);
};

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

export const ParentReportPDF = ({ data }: { data: StudentData }) => {
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
    
    const districtDisplay = data.district_name ? data.district_name : "_______________________";
    
    // 🔥 FORMAT TAREHE KABLA YA KUONYESHA - ZITAONGEA SIKU 1!
    const closingDateFormatted = formatDate(data.closing_date);
    const openingDateFormatted = formatDate(data.opening_date);
    const teacherDateFormatted = formatDate(data.teacher_date);
    const headmasterDateFormatted = formatDate(data.headmaster_date);
    
    return (
        <Document>
            <Page size="A4" orientation="portrait" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>JAMHURI YA MUUNGANO WA TANZANIA</Text>
                    <Text style={styles.headerText}>OFISI YA RAIS TAMISEMI</Text>
                    <Text style={styles.headerText}>HALMASHAURI YA WILAYA YA {districtDisplay}</Text>
                    <Text style={styles.headerText}>{data.school_name.toUpperCase()}</Text>
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

                {/* 🔥 MANENO YOTE YANAYOFUATA - TAREHE ZIMEONGEZWA SIKU 1! */}
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

                    {/* 🔥 TAREHE ZINAONYESHA SIKU 1 NYUMA - ZIMESAHAHISHWA! */}
                    <Text style={{ marginTop: 2, marginBottom: 2 }}>
                        A. Shule imefungwa tarehe: <Text style={styles.boldText}>{closingDateFormatted}</Text> &nbsp;&nbsp;&nbsp; 
                        Itafunguliwa tarehe: <Text style={styles.boldText}>{openingDateFormatted}</Text>
                    </Text>

                    <View style={styles.remarks}>
                        <Text>B. Maoni ya mwalimu wa darasa kuhusu masomo na tabia:</Text>
                        <Text>{data.teacher_remarks}</Text>
                        <Text style={styles.signatureLine}>
                            Tarehe: {teacherDateFormatted} &nbsp;&nbsp;&nbsp; 
                            Sahihi: ________________________ &nbsp;&nbsp;&nbsp; 
                            (Jina: {data.teacher_name})
                        </Text>
                    </View>

                    <View style={styles.remarks}>
                        <Text>C. Maoni ya Mkuu wa Shule:</Text>
                        <Text>{data.headmaster_remarks}</Text>
                        <Text style={styles.signatureLine}>
                            Tarehe: {headmasterDateFormatted} &nbsp;&nbsp;&nbsp; 
                            Sahihi: ________________________ &nbsp;&nbsp;&nbsp; 
                            (Jina: {data.headmaster_name})
                        </Text>
                    </View>

                    <Text style={styles.separator}>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</Text>

                    <Text style={styles.cutLine}>• • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • • •</Text>

                    <View style={styles.parentSection}>
                        <Text>D. MAONI YA MZAZI/MLEZI KUHUSU MWANAO (IRUDISHWE SHULENI BAADA YA KUJAZA MAONI YAKO KUHUSU MAENDELEO YA MWANAO</Text>
                        <Text>KITAALUMA, KITABIA NA KUKIRI KUPOKEA TAARIFA HII:</Text>
                        <Text>....................................................................................................................................................................................................................</Text>
                        <Text>.......................................................................................................................................................................................................................</Text>
                        <Text>...........................................................................................................................................................................................................................</Text>
                        <Text>JINA LA MZAZI/MLEZI: ___________________________________________ &nbsp;&nbsp;&nbsp; Sahihi: ___________________ &nbsp;&nbsp;&nbsp; Tarehe: ____________________</Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};