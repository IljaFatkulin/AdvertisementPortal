import Navbar from "../../components/Navbar/Navbar";
import {Link} from "react-router-dom";
import { useTranslation } from 'react-i18next';

export const About = () => {
    const { t } = useTranslation();

    return (
        <div className={"container"}>
                <div className={"header"}>
                    <Navbar/>
                    <h1>{t('About us')}</h1>
                    <div className={"return"}>
                        <Link to={'/'} id={"return"}><p className={"return-link"}>{t('Categories')}</p></Link>
                        <p>{t('About us')}</p>
                    </div>
                </div>

                <div style={{display: "flex", justifyContent: "center"}}>
                    <div style={{width: "30%"}}>
                    <h1 style={{fontSize: 32}}>{t('Introduction')}</h1>
                    <p style={{ fontSize: 24, wordBreak: "break-word"}}>{t('Welcome to Ads Marketplace - your one-stop solution for all advertising needs. At Ads Marketplace, we bridge the gap between businesses looking to advertise and platforms offering advertising space, making the process seamless, efficient, and effective.')}</p>

                    <h1 style={{fontSize: 32}}>{t('Our Mission')}</h1>
                    <p style={{ fontSize: 24, wordBreak: "break-word"}}>{t('Our mission is to revolutionize the advertising industry by providing a comprehensive and user-friendly portal that caters to all your advertising requirements. We aim to empower businesses of all sizes to reach their target audience effectively and affordably.')}</p>

                    <h1 style={{fontSize: 32}}>{t('Our Vision')}</h1>
                    <p style={{ fontSize: 24, wordBreak: "break-word"}}>{t('We envision a world where advertising is accessible, transparent, and measurable. By leveraging technology, we strive to create a marketplace that offers diverse advertising opportunities, ensuring businesses can find the perfect match for their marketing campaigns.')}</p>

                    <h1>{t('What We Offer')}</h1>
                    <ul style={{ fontSize: 24}}>
                        <li>{t('User-Friendly Interface: Our portal is designed to be intuitive and easy to navigate, ensuring a hassle-free experience for users.')}</li>
                        <li>{t('Affordable Solutions: We offer competitive pricing models to suit businesses of all budgets.')}</li>
                        <li>{t('Analytics and Reporting: Our advanced analytics tools help you track the performance of your ads in real-time.')}</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default About;