import Footer from '../components/Footer';
import Banner from '../components/HomeComponents/Banner';
import MyExpertise from '../components/HomeComponents/Expertise/MyExpertise';
import Recommendations from '../components/HomeComponents/Recommendations/Recommendations';
import ClientReviews from '../components/HomeComponents/ClientReviews/ClientReviews';
import SEO from '../components/Common/SEO';
import { SITE } from '../constants/site';

const personJsonLd = {
    '@type': 'Person',
    name: SITE.name,
    url: SITE.url,
    jobTitle: 'Full Stack Engineer',
    description: SITE.description,
    sameAs: [
        'https://github.com/batcampglobalservices',
        'https://www.linkedin.com/in/batombari-bakpo-023091414/',
        'https://x.com/BBatombari699',
        'https://www.facebook.com/batombarib.144/',
    ],
};

const websiteJsonLd = {
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
};

const homeJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [personJsonLd, websiteJsonLd],
};

const home = () => {
    return (
        <div className="Home-Page -z-10">
            <SEO
                path="/"
                jsonLd={homeJsonLd}
            />
            <Banner />
            <MyExpertise />
            <Recommendations />
            <ClientReviews />
            <Footer />

        </div>
    )
}

export default home