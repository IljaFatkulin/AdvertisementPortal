import React, { useEffect, useState } from 'react';
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
        // marginTop: 10,
        flexDirection: 'row',
        padding: 5,
        backgroundColor: '#f0f0f0',
        marginRight: 20,
        alignItems: 'stretch',
        // justifyContent: 'space-between',
    },
    row2: {
        // marginTop: 10,
        flexDirection: 'row',
        padding: 5,
        backgroundColor: '#f9f7f9',
        marginRight: 20,
        alignItems: 'stretch',
        // justifyContent: 'space-between',
    },
    column: {
        width: '50%'
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
const PDFStats = ({favoriteCount, name, price, description, seller, createdAt, totalViews, authorized, guest}) => {
    const { t } = useTranslation();
    const currentDate = new Date().toISOString().split('T')[0];

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.content}>
                    <Text style={styles.mb20}>{t('Statistics for advertisement')}</Text>
                    <View style={styles.row1}><Text style={styles.column}>{t('Name')}:</Text><Text>{name}</Text></View>
                    <View style={styles.row2}><Text style={styles.column}>{t('Price')}:</Text><Text>{price}</Text></View>
                    <View style={styles.row1}><Text style={styles.column}>{t('Description')}:</Text><Text>{description}</Text></View>
                    <View style={styles.row2}><Text style={styles.column}>{t('Seller')}:</Text><Text>{seller}</Text></View>
                    <View style={styles.row1}><Text style={styles.column}>{t('Created at')}:</Text><Text>{createdAt}</Text></View>
                    <View style={styles.row2}><Text style={styles.column}>{t('Total views')}:</Text><Text>{totalViews}</Text></View>
                    <View style={styles.row1}><Text style={styles.column}>{t('Authorized users views')}:</Text><Text>{authorized}</Text></View>
                    <View style={styles.row2}><Text style={styles.column}>{t('Guests views')}:</Text><Text>{guest}</Text></View>
                    <View style={styles.row1}><Text style={styles.column}>{t('Users count saved ads to favorite')}:</Text><Text>{favoriteCount}</Text></View>

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