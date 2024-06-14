import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Image } from '@react-pdf/renderer';
import { useTranslation } from 'react-i18next';

Font.register({
    family: 'Roboto',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf'
});

// Create styles
const styles = StyleSheet.create({
    content: {
        margin: 20,
        padding: 20,
        flexDirection: 'column',
        width: '100%',
        border: '1px solid #ddd',
        borderRadius: 10,
        backgroundColor: '#fff',
    },
    page: {
        fontFamily: 'Roboto',
        flexDirection: 'column',
        padding: 20,
        paddingRight: 60, // Increased right padding
        backgroundColor: '#f2f2f2',
    },
    header: {
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 10,
        paddingLeft: 20,
        paddingRight: 60, // Increased right padding for rows
        alignItems: 'center',
        borderBottom: '1px solid #ddd',
        justifyContent: 'space-between',
    },
    rowAlternate: {
        backgroundColor: '#f9f9f9',
    },
    column: {
        width: '50%',
        fontSize: 12,
        color: '#333',
        paddingRight: 10, // Ensure right padding for all columns
    },
    mb20: {
        marginBottom: 20,
        fontSize: 14,
        color: '#555',
    },
    right: {
        marginTop: 100,
        paddingRight: 60, // Increased right padding for right-aligned text
        width: '100%',
        textAlign: 'right',
        fontSize: 12,
        color: '#333',
    },
    spacebetween: {
        marginTop: 20,
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 60, // Increased right padding for spacebetween
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        borderTop: '1px solid #ddd',
    },
    img: {
        margin: 10,
        width: '100%',
        height: 'auto',
    },
    columnRight: {
        textAlign: "right",
        fontSize: 12,
        color: '#333',
    }
});

// Create Document Component
const AdsPDF = ({id, name, price, description, seller, createdAt, attributes, images}) => {
    const { t } = useTranslation();
    const currentDate = new Date().toISOString().split('T')[0];

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.content}>
                    <Text style={styles.header}>{t('Statistics for advertisement')}</Text>
                    <View style={[styles.row, styles.rowAlternate]}><Text style={styles.column}>{t('Advertisement number')}:</Text><Text style={styles.column}>{id}</Text></View>
                    <View style={styles.row}><Text style={styles.column}>{t('Name')}:</Text><Text style={styles.column}>{name}</Text></View>
                    <View style={[styles.row, styles.rowAlternate]}><Text style={styles.column}>{t('Price')}:</Text><Text style={styles.column}>{price}</Text></View>
                    <View style={styles.row}><Text style={styles.column}>{t('Description')}:</Text><Text style={styles.column}>{description}</Text></View>
                    <View style={[styles.row, styles.rowAlternate]}><Text style={styles.column}>{t('Seller')}:</Text><Text style={styles.column}>{seller}</Text></View>
                    <View style={styles.row}><Text style={styles.column}>{t('Created at')}:</Text><Text style={styles.column}>{createdAt}</Text></View>
                    {attributes.map((attribute, index) => (
                        <View key={index} style={[styles.row, index % 2 === 0 ? styles.rowAlternate : null]}>
                            <Text style={styles.column}>{attribute.attribute.name}:</Text>
                            <Text style={styles.column}>{attribute.value}</Text>
                        </View>
                    ))}

                    {images.map((image, index) => (
                        <Image key={index} src={image} style={styles.img} />
                    ))}
                    <View style={styles.spacebetween}>
                        <Text>{t('Date')}: {currentDate}</Text>

                        <View style={styles.columnRight}>
                            <Text>Ads Marketplace</Text>
                            <Text>ads@marketplace.lv</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default AdsPDF;
