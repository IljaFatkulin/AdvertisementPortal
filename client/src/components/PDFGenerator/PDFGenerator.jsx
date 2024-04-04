import React, { useState, useEffect } from 'react';
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import jsPDF from 'jspdf';
import ProductViewService from '../../api/ProductViewService';
import AdvertisementService from "../../api/AdvertisementService";
import 'jspdf-autotable';
import Loader from '../Loader/Loader';

const PDFGenerator = () => {
    const {category, id} = useParams();
    const [advertisement, setAdvertisement] = useState({});
    const [views, setViews] = useState(0);
    const [authViews, setAuthViews] = useState(0);

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        ProductViewService.getAllViews(id)
            .then(r => {
                setViews(r.data);
                console.log(r.data);
            }).catch(e => {
                console.log(e);
            });

        ProductViewService.getAuthorizedViews(id)
        .then(r => {
            setAuthViews(r.data);
            console.log(r.data);
        }).catch(e => {
            console.log(e);
        });

        AdvertisementService.getById(id)
            .then(response => {
                const ads = response;
                ads.imagesBytes = response.imagesBytes.map(image => {
                    return {id: image.id, image: image.image};
                });
                console.log(ads);
                setAdvertisement(ads);
                setIsLoading(false);
            })
            .catch(e => {
                console.log(e.response.data);
            })
    }, []);

    const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Advertisement details', 10, 10);
    doc.autoTable({ html: '#my-table' });

    doc.save('details.pdf');
    };

    if(isLoading) {
        return (
            <Loader />
        )
    }

    return (
    <div className='PDFGenerator'>
        <Link to={`/advertisements/${category}/${id}`}><button>Back</button></Link>
        <br />
        <button onClick={generatePDF}>Download PDF</button>
        <table id="my-table">
        <tbody>
            <tr>
                <td>Name</td>
                <td>{advertisement.name}</td>
            </tr>
            <tr>
                <td>Price</td>
                <td>€{advertisement.price}</td>
            </tr>
            <tr>
                <td>Description</td>
                <td>{advertisement.description}</td>
            </tr>
            <tr>
                <td>Seller</td>
                <td>{advertisement.seller.email}</td>
            </tr>
            <tr>
                <td>Created at</td>
                <td>{new Date(advertisement.createdAt).toLocaleDateString()}</td>
            </tr>
            <tr>
                <td>Total views:</td>
                <td>{views}</td>
            </tr>
            <tr>
                <td>Authorized users views:</td>
                <td>{authViews}</td>
            </tr>
            <tr>
                <td>Guests views:</td>
                <td>{views - authViews}</td>
            </tr>
        </tbody>
        </table>
    </div>
    );
};

export default PDFGenerator;
