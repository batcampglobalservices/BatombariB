import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import BannerLayout from "../components/Common/BannerLayout";
import Footer from "../components/Footer";
import PortfolioCard from "../components/Portfolio/PortfolioCard";
import axios from "axios";
import { Skeleton } from "antd";
import ImageAndParagraphSkeleton from "../components/Common/ImageAndParagraphSkeleton";
import SEO from "../components/Common/SEO";

const Portfolio = () => {

    const { isLoading, error, data } = useQuery({
        queryKey: ['portfolio'],
        queryFn: () => axios.get('/api/portfolio')
            .then(({ data }) => data)
            .catch(error => console.error('Error fetching portfolio:', error))
    })
    return (
        <BannerLayout>
            <SEO
                title="Portfolio"
                description="Explore selected web development and software engineering projects built by Batombari Bakpo."
                path="/portfolio"
            />
            <h1 className="sr-only">Portfolio Projects</h1>
            <div className="grid justify items-center grid-flow-row md:grid-cols-2 grid-rows-auto gap-4 px-8 my-6">

                {
                    isLoading ?
                        [1, 2, 3, 4].map((item, idx) => (
                            <ImageAndParagraphSkeleton key={idx} className={"w-full object-cover"} />
                        ))
                        :
                        data?.map((item, key) => (
                            <PortfolioCard key={item._id || item.id || key} data={item} />
                        ))

                }



            </div >
            <Footer />
        </BannerLayout >
    );
};

export default Portfolio;
