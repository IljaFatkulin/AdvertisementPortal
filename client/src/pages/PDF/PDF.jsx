import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import PDFStats from '../../components/PDFStats/PDFStats';

const PDF = () => {
    return (
        <PDFViewer width="100%" height="1000">
            <PDFStats />
        </PDFViewer>
    );
};

export default PDF;