import { useState } from 'react';
import BannerLayout from '../components/Common/BannerLayout';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { SiUpwork } from 'react-icons/si'
import { HiMail, HiUser } from 'react-icons/hi'
import { BsChatTextFill } from 'react-icons/bs'
import Fiverr_Icon from '../components/Fiverr_Icon';
import Footer from '../components/Footer';
import { Modal } from 'antd';
import axios from 'axios';

const Contact = () => {
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [modalContent, setModalContent] = useState({
        title: '',
        message: '',
        isSuccess: false
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        // Basic validation
        if (!formData.name || !formData.email || !formData.message) {
            setModalContent({
                title: 'Error',
                message: 'Please fill in all fields',
                isSuccess: false
            })
            setIsOpen(true)
            return
        }

        setIsLoading(true)

        try {
            const response = await axios.post('/api/contact', formData)
            
            if (response.data.success) {
                setModalContent({
                    title: 'Success!',
                    message: 'Thank you for your message. I will get back to you soon!',
                    isSuccess: true
                })
                // Clear form
                setFormData({
                    name: '',
                    email: '',
                    message: ''
                })
            }
        } catch (error) {
            setModalContent({
                title: 'Error',
                message: error.response?.data?.message || 'Failed to send message. Please try again later.',
                isSuccess: false
            })
        } finally {
            setIsLoading(false)
            setIsOpen(true)
        }
    }

    return (
        <BannerLayout>
            <div className=" px-4 py-2">
                <div className="my-6 text-Snow flex flex-col gap-y-5">
                    <h1 className='text-lg font-bold'>Contact Information</h1>
                    <div className="flex flex-col md:flex-row items-center gap-5 text-xs">
                        <div className="card_stylings w-full md:w-1/2 p-5 md:p-6 lg:p-8 flex flex-col gap-y-4">
                            <div className="flex justify-between items-center">
                                <span className='md:text-base'>Country:</span>
                                <span className='text-LightGray md:text-sm'>Nigeria</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className='md:text-base'>City:</span>
                                <span className='text-LightGray md:text-sm'>Nsukka</span>
                            </div>
                        </div>
                        <div className="card_stylings rounded-xl w-full md:w-1/2 p-5 md:p-6 lg:p-8 flex flex-col gap-y-4">
                            <div className="flex justify-between items-center">
                                <span className='md:text-base'>Email:</span>
                                <span className='text-LightGray text-sm'>bakpobatombari@gmail.com</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className='md:text-base'>Linkedin:</span>
                                <span className='text-LightGray text-sm'>Batombari Bakpo</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className='md:text-base'>Phone:</span>
                                <span className='text-LightGray text-sm'>+234 7048142915</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="h-16 w-full card_stylings text-xl sm:text-3xl flex gap-x-8 sm:gap-x-16 items-center justify-center text-Snow">
                    <a className='hover:scale-125 ease-in-out duration-700' href="" target='_blank' rel="noreferrer"><HiMail /></a>
                    <a className='hover:scale-125 ease-in-out duration-700' href="https://github.com/batcampglobalservices" target='_blank' rel="noreferrer"><FaGithub /></a>
                    <a className='hover:scale-125 ease-in-out duration-700' href="hhttps://www.linkedin.com/in/batombari-bakpo-285455328/" target='_blank' rel="noreferrer"><FaLinkedin /></a>
                    {/* <a className='hover:scale-125 ease-in-out duration-700' href="https://x.com/iosamajavaid" target='_blank' rel="noreferrer"><FaTwitter /></a> */}
                </div>


                <div className="my-12 w-full h-auto text-Snow">
                    <h1 className='text-lg font-bold'>Get In Touch</h1>
                    <form onSubmit={handleSubmit} className="mt-4 py-8 px-8 bg-EveningBlack rounded-xl text-sm">
                        <div>
                            <div className="flex flex-col w-full">
                                <div className="userIcon relative mb-6">
                                    <div id="icon" className="absolute inset-y-0 left-0 flex items-center pl-3 text-xl pointer-events-none">
                                        <HiUser />
                                    </div>
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="input_stylings" 
                                        placeholder="Name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col w-full">
                                <div className="mailIcon relative mb-6">
                                    <div id="icon" className="absolute inset-y-0 left-0 flex items-center text-xl pl-3 pointer-events-none">
                                        <HiMail />
                                    </div>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="input_stylings" 
                                        placeholder="Email"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col w-full">
                                <div className="textIcon relative mb-6">
                                    <div id="icon" className="absolute top-3 left-0 flex items-center text-lg pl-3 pointer-events-none">
                                        <BsChatTextFill />
                                    </div>
                                    <textarea 
                                        rows={6} 
                                        cols={50} 
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        className="input_stylings" 
                                        placeholder="Message"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="my-4">
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="button disabled:opacity-50 disabled:cursor-not-allowed"
                                > 
                                    {isLoading ? 'SENDING...' : 'SEND MESSAGE'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            {/* success/error modal */}
            <Modal
                className='card_stylings backdrop-blur-3xl drop-shadow-2xl'
                centered
                open={isOpen}
                footer={null}
                closable={false}
                onOk={() => setIsOpen(false)}
                onCancel={() => setIsOpen(false)}
            >
                <div className='flex flex-col items-center justify-center'>
                    <h1 className={`font-bold text-2xl ${modalContent.isSuccess ? 'text-Green' : 'text-red-500'}`}>
                        {modalContent.title}
                    </h1>
                    <p className='text-Snow mt-4 text-center'>{modalContent.message}</p>
                    <button 
                        onClick={() => setIsOpen(false)} 
                        className='mt-6 px-6 py-2 bg-Green text-DeepNightBlack rounded-lg hover:bg-opacity-80 transition-all'
                    >
                        Close
                    </button>
                </div>
            </Modal>
            <Footer />
        </BannerLayout>

    )
}

export default Contact