import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { useTranslation } from 'react-i18next';

Font.register({
    family: 'Roboto',
    src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf'
});

// Create styles
const styles = StyleSheet.create({
    content: {
        margin: 10,
        padding: 10,
        flexDirection: 'column',
        width: '100%'
    },
    page: {
        fontFamily: 'Roboto',
        flexDirection: 'column',
    },
    row1: {
        flexDirection: 'row',
        padding: 5,
        backgroundColor: '#f0f0f0',
        marginRight: 20,
        alignItems: 'stretch',
        flexWrap: 'wrap',
    },
    row2: {
        flexDirection: 'row',
        padding: 5,
        backgroundColor: '#f9f7f9',
        marginRight: 20,
        alignItems: 'stretch',
        flexWrap: 'wrap',
    },
    column: {
        width: '50%',
        wordBreak: 'break-word',
        flexWrap: 'wrap'
    },
    mb20: {
        marginBottom: 20
    },
    right: {
        marginTop: 100,
        paddingRight: 20,
        width: '100%',
        textAlign: "right",
    },
    spacebetween: {
        marginTop: 100,
        paddingRight: 20,
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    columnRight: {
        width: '50%',
        textAlign: "right",
    }
});

// Create Document Component
const PDFStats = ({favoriteCount, id, name, price, description, seller, createdAt, totalViews, authorized, guest}) => {
    const { t } = useTranslation();
    const currentDate = new Date().toISOString().split('T')[0];

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.content}>
                    <Text style={styles.mb20}>{t('Statistics for advertisement')}</Text>
                    <View style={styles.row1}><Text style={styles.column}>{t('Advertisement number')}:</Text><Text style={styles.column}>{id}</Text></View>
                    <View style={styles.row1}><Text style={styles.column}>{t('Name')}:</Text><Text style={styles.column}>{name}</Text></View>
                    <View style={styles.row2}><Text style={styles.column}>{t('Price')}:</Text><Text style={styles.column}>{price}</Text></View>
                    <View style={styles.row1}><Text style={styles.column}>{t('Description')}:</Text><Text style={styles.column}>{description}</Text></View>
                    <View style={styles.row2}><Text style={styles.column}>{t('Seller')}:</Text><Text style={styles.column}>{seller}</Text></View>
                    <View style={styles.row1}><Text style={styles.column}>{t('Created at')}:</Text><Text style={styles.column}>{createdAt}</Text></View>
                    <View style={styles.row2}><Text style={styles.column}>{t('Total views')}:</Text><Text style={styles.column}>{totalViews}</Text></View>
                    <View style={styles.row1}><Text style={styles.column}>{t('Authorized users views')}:</Text><Text style={styles.column}>{authorized}</Text></View>
                    <View style={styles.row2}><Text style={styles.column}>{t('Guests views')}:</Text><Text style={styles.column}>{guest}</Text></View>
                    <View style={styles.row1}><Text style={styles.column}>{t('Users count saved ads to favorite')}:</Text><Text style={styles.column}>{favoriteCount}</Text></View>

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

export default PDFStats;
