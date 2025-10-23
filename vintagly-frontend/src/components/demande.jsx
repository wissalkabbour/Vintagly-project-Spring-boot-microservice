import React, { useState } from "react";

export const Component = () => {
    const [formData, setFormData] = useState({
        businessName: '',
        contactName: '',
        email: '',
        phone: '',
        description: '',
        categories: [],
        eras: [],
        photos: [],
        businessLicense: null,
        taxDoc: null,
        termsAccepted: false,
        marketingConsent: false
    });
    
    const [showModal, setShowModal] = useState(false);
    const [photosPreviews, setPhotosPreviews] = useState([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCheckboxChange = (e, field) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [field]: checked 
                ? [...prev[field], value]
                : prev[field].filter(item => item !== value)
        }));
    };

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files);
        const validFiles = files.filter(file => {
            const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
            const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB
            return isValidType && isValidSize;
        });

        setFormData(prev => ({ ...prev, photos: [...prev.photos, ...validFiles].slice(0, 5) }));
        
        // Créer des aperçus pour affichage
    const previews = validFiles.map(file => URL.createObjectURL(file));
    setPhotosPreviews(prev => [...prev, ...previews].slice(0, 5));

        // Create previews
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotosPreviews(prev => [...prev, reader.result].slice(0, 5));
            };
            reader.readAsDataURL(file);
        });
    };

    const handleFileChange = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, [field]: file }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validation basique
        if (!formData.businessName || !formData.contactName || !formData.email || !formData.phone) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }
        
        if (formData.categories.length === 0 || formData.eras.length === 0) {
            alert('Veuillez sélectionner au moins une catégorie et une ère');
            return;
        }
        
        if (!formData.termsAccepted) {
            alert('Veuillez accepter les conditions générales');
            return;
        }

        // Afficher la modal de succès
        setShowModal(true);
        
        // Log des données (en production, vous enverriez cela à un serveur)
        console.log('Application submitted:', formData);
    };

    const closeModal = () => {
        setShowModal(false);
        // Reset form
        setFormData({
            businessName: '',
            contactName: '',
            email: '',
            phone: '',
            description: '',
            categories: [],
            eras: [],
            photos: [],
            businessLicense: null,
            taxDoc: null,
            termsAccepted: false,
            marketingConsent: false
        });
        setPhotosPreviews([]);
    };

    return (
        <form onSubmit={handleSubmit}>
        <div id="webcrumbs">
            <div className="min-h-screen p-4 md:p-8 font-serif">
                <div className="max-w-8xl w-full mx-auto bg-white rounded-lg shadow-xl overflow-hidden border border-[#c89563]">
                    <div className="bg-[#3d3734] text-white p-6 flex items-center justify-between">
                        <h1 className="text-2xl md:text-3xl font-bold italic">Vintagely</h1>
                        <p className="text-[#d4b5a6]">Vendor Application</p>
                    </div>

                    <div className="p-6">
                        <div className="mb-8 border-b border-[#c89563] pb-4">
                            <h2 className="text-xl font-bold text-[#4a6660] mb-2">Become a Vintagely Vendor</h2>
                            <p className="text-[#3d3734]">
                                Join our curated marketplace of authentic vintage treasures. Complete the application
                                below to start your journey with us.
                            </p>
                        </div>

                        <div className="mb-8">
                            <div className="flex mb-4">
                                <div className="w-10 h-10 rounded-full bg-[#4a6660] text-white flex items-center justify-center mr-3">
                                    1
                                </div>
                                <h3 className="text-lg font-semibold text-[#3d3734] pt-2">Personal Information</h3>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 ml-14">
                                <div>
                                    <label className="block text-[#3d3734] mb-2">Business/Vendor Name *</label>
                                    <input
                                        type="text"
                                        className="w-full border border-[#a8b5b2] rounded p-2 focus:border-[#c89563] focus:ring-1 focus:ring-[#c89563] transition duration-200"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#3d3734] mb-2">Contact Name *</label>
                                    <input
                                        type="text"
                                        className="w-full border border-[#a8b5b2] rounded p-2 focus:border-[#c89563] focus:ring-1 focus:ring-[#c89563] transition duration-200"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#3d3734] mb-2">Email Address *</label>
                                    <input
                                        type="email"
                                        className="w-full border border-[#a8b5b2] rounded p-2 focus:border-[#c89563] focus:ring-1 focus:ring-[#c89563] transition duration-200"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-[#3d3734] mb-2">Phone Number *</label>
                                    <input
                                        type="tel"
                                        className="w-full border border-[#a8b5b2] rounded p-2 focus:border-[#c89563] focus:ring-1 focus:ring-[#c89563] transition duration-200"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <div className="flex mb-4">
                                <div className="w-10 h-10 rounded-full bg-[#4a6660] text-white flex items-center justify-center mr-3">
                                    2
                                </div>
                                <h3 className="text-lg font-semibold text-[#3d3734] pt-2">
                                    About Your Vintage Collection
                                </h3>
                            </div>

                            <div className="ml-14">
                                <div className="mb-4">
                                    <label className="block text-[#3d3734] mb-2">
                                        Tell us about your items and expertise *
                                    </label>
                                    <textarea
                                        rows="4"
                                        className="w-full border border-[#a8b5b2] rounded p-2 focus:border-[#c89563] focus:ring-1 focus:ring-[#c89563] transition duration-200"
                                        placeholder="Describe your collection, sourcing methods, years of experience, etc."
                                        required
                                    ></textarea>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <label className="block text-[#3d3734] mb-2">
                                            Categories (Select all that apply) *
                                        </label>
                                        <div className="space-y-2">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="mr-2 text-[#4a6660] focus:ring-[#4a6660]"
                                                />
                                                <span>Furniture</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="mr-2 text-[#4a6660] focus:ring-[#4a6660]"
                                                />
                                                <span>Clothing</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="mr-2 text-[#4a6660] focus:ring-[#4a6660]"
                                                />
                                                <span>Accessories</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="mr-2 text-[#4a6660] focus:ring-[#4a6660]"
                                                />
                                                <span>Home Décor</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="mr-2 text-[#4a6660] focus:ring-[#4a6660]"
                                                />
                                                <span>Collectibles</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-[#3d3734] mb-2">
                                            Eras (Select all that apply) *
                                        </label>
                                        <div className="space-y-2">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="mr-2 text-[#4a6660] focus:ring-[#4a6660]"
                                                />
                                                <span>Pre-1920s</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="mr-2 text-[#4a6660] focus:ring-[#4a6660]"
                                                />
                                                <span>1920s-1940s</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="mr-2 text-[#4a6660] focus:ring-[#4a6660]"
                                                />
                                                <span>1950s-1960s</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="mr-2 text-[#4a6660] focus:ring-[#4a6660]"
                                                />
                                                <span>1970s-1980s</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className="mr-2 text-[#4a6660] focus:ring-[#4a6660]"
                                                />
                                                <span>1990s</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
    <div className="flex mb-4">
        <div className="w-10 h-10 rounded-full bg-[#4a6660] text-white flex items-center justify-center mr-3">
            3
        </div>
        <h3 className="text-lg font-semibold text-[#3d3734] pt-2">Photo Samples</h3>
    </div>

    <div className="ml-14">
        <p className="mb-3 text-sm text-[#3d3734]">
            Please upload 3-5 photos of your items that represent your collection quality.
        </p>
        <div className="border-2 border-dashed border-[#a8b5b2] rounded-lg p-6 text-center hover:border-[#c89563] transition duration-200">
            <span className="material-symbols-outlined text-5xl text-[#4a6660]">
                upload_file
            </span>
            <p className="mt-2">
                Drag photos here or{" "}
                <label className="text-[#4a6660] underline cursor-pointer">
                    browse files
                    <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handlePhotoUpload}
                    />
                </label>
            </p>
            <p className="text-sm mt-1 text-gray-500">JPG, PNG or WEBP, max 5MB each</p>
        </div>

        {/* Aperçus des photos */}
        <div className="flex mt-4 space-x-4">
            {photosPreviews.map((src, index) => (
                <img
                    key={index}
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="w-20 h-20 object-cover rounded border"
                />
            ))}
        </div>
    </div>
</div>

                        <div className="mb-8">
                            <div className="flex mb-4">
                                <div className="w-10 h-10 rounded-full bg-[#4a6660] text-white flex items-center justify-center mr-3">
                                    4
                                </div>
                                <h3 className="text-lg font-semibold text-[#3d3734] pt-2">Business Documentation</h3>
                            </div>

                            <div className="ml-14">
                                <p className="mb-3 text-sm text-[#3d3734]">
                                    Optional: Upload any business licenses or tax documentation.
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[#3d3734] mb-2">Business License (Optional)</label>
                                        <input
                                            type="file"
                                            className="w-full text-sm text-[#3d3734] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#a8b5b2] file:text-white hover:file:bg-[#4a6660] file:cursor-pointer file:transition file:duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[#3d3734] mb-2">
                                            Tax ID / Documentation (Optional)
                                        </label>
                                        <input
                                            type="file"
                                            className="w-full text-sm text-[#3d3734] file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[#a8b5b2] file:text-white hover:file:bg-[#4a6660] file:cursor-pointer file:transition file:duration-200"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="ml-14 mb-8">
                            <div className="bg-[#d4b5a6] bg-opacity-20 p-4 rounded border-l-4 border-[#c89563]">
                                <div className="flex items-start mb-4">
                                    <input
                                        type="checkbox"
                                        className="mt-1 mr-3 text-[#4a6660] focus:ring-[#4a6660]"
                                        required
                                    />
                                    <p className="text-sm text-[#3d3734]">
                                        I confirm that all items I will sell on Vintagely are authentic vintage pieces
                                        (at least 20 years old) and I have the right to sell them. I agree to
                                        Vintagely's{" "}
                                        <span className="underline cursor-pointer text-[#4a6660]">
                                            Terms and Conditions
                                        </span>{" "}
                                        and{" "}
                                        <span className="underline cursor-pointer text-[#4a6660]">
                                            Seller Guidelines
                                        </span>
                                        .
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        className="mt-1 mr-3 text-[#4a6660] focus:ring-[#4a6660]"
                                        required
                                    />
                                    <p className="text-sm text-[#3d3734]">
                                        I consent to receive marketing communications from Vintagely. You may
                                        unsubscribe at any time.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center mt-8">
                            <button
                                type="submit"
                                className="bg-[#4a6660] text-white py-3 px-8 rounded-md hover:bg-[#3d5750] transition duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4a6660] focus:ring-opacity-50"
                            >
                                Submit Application
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#a8b5b2] bg-opacity-30 p-6 text-center">
                        <p className="text-sm text-[#3d3734]">
                            Once submitted, our team will review your application within 3-5 business days.
                        </p>
                        <p className="text-sm text-[#3d3734] mt-2">
                            Questions? Contact <span className="underline text-[#4a6660]">vendors@vintagely.com</span>
                        </p>
                    </div>

                    {/* Success Message Modal (Hidden by default) */}
                    <div className="hidden absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-lg shadow-2xl border-2 border-[#c89563] max-w-md w-full z-10">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-[#4a6660] rounded-full mx-auto flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-3xl text-white">check</span>
                            </div>
                            <h2 className="text-xl font-bold text-[#3d3734] mb-2">Application Received!</h2>
                            <p className="text-[#3d3734] mb-4">
                                Thank you for applying to become a Vintagely vendor. We've received your application and
                                will be in touch soon.
                            </p>
                            <p className="text-sm text-[#4a6660]">Application Reference: #VIN23789</p>
                            <button className="mt-6 bg-[#c89563] text-white py-2 px-6 rounded hover:bg-[#b78553] transition duration-200">
                                Close
                            </button>
                        </div>
                    </div>
                    {/* Next: "Add a progress bar at the top to indicate form completion stages" */}
                </div>
            </div>
        </div>
        </form>
    )
}
