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
const ProfilePDF = ({title, data, type}) => {
    const { t } = useTranslation();
    const currentDate = new Date().toISOString().split('T')[0];

    const renderTitle = () => {
        if (type === 'profile') {
            return <Text style={styles.mb20}>{t('Profile statistics')}: {title}</Text>
        } else if (type === 'category') {
            return <Text style={styles.mb20}>{t('Category statistics')}: {title}</Text>
        } else if (type === 'section') {
            return <Text style={styles.mb20}>{t('Section statistics')}: {title}</Text>
        }
    }
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.content}>
                    {renderTitle()}
                    <View style={styles.row1}><Text style={styles.column}>{t('Active advertisements')}:</Text><Text>{data.activeAds}</Text></View>
                    <View style={styles.row2}><Text style={styles.column}>{t('Total views')}:</Text><Text>{data.viewCount}</Text></View>
                    <View style={styles.row1}><Text style={styles.column}>{t('Authorized users views')}:</Text><Text>{data.authViewCount}</Text></View>
                    <View style={styles.row2}><Text style={styles.column}>{t('Guests views')}:</Text><Text>{data.viewCount - data.authViewCount}</Text></View>
                    <View style={styles.row1}><Text style={styles.column}>{t('Users count saved ads to favorite')}:</Text><Text>{data.favoriteCount}</Text></View>
                    <View style={styles.row2}><Text style={styles.column}>{t('Views in last month')}:</Text><Text>{data.viewCountLastMonth}</Text></View>
                    <View style={styles.row1}><Text style={styles.column}>{t('Authorized views in last month')}:</Text><Text>{data.authViewCountLastMonth}</Text></View>
                    <View style={styles.row2}><Text style={styles.column}>{t('Guests views in last month')}:</Text><Text>{data.viewCountLastMonth - data.authViewCountLastMonth}</Text></View>

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

export default ProfilePDF;