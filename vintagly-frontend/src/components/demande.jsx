import React, { useState, useEffect } from "react";
import { getCategories } from "../services/categoryService";

export default function Component() {
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

    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    
    const erasList = [
        'PRE_1920S',
        'ERA_1920S_1940S',
        'ERA_1950S_1960S',
        'ERA_1970S_1980S',
        'ERA_1990S'
    ];

    const [selectedEra, setSelectedEra] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [photosPreviews, setPhotosPreviews] = useState([]);
    const [certificationPreview, setCertificationPreview] = useState(null);

    // Récupérer les catégories depuis l'API au chargement du composant
    useEffect(() => {
        const fetchCategories = async () => {
            setLoadingCategories(true);
            const data = await getCategories();
            setCategories(data);
            setLoadingCategories(false);
        };
        
        fetchCategories();
    }, []);

    const formatEra = (era) => {
        return era
            .replace('PRE_', 'Pre-')
            .replace('ERA_', '')
            .replace(/_/g, '-');
    };

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
            const isValidSize = file.size <= 5 * 1024 * 1024;
            return isValidType && isValidSize;
        });

        setFormData(prev => ({ ...prev, photos: [...prev.photos, ...validFiles].slice(0, 5) }));
        
        const previews = validFiles.map(file => URL.createObjectURL(file));
        setPhotosPreviews(prev => [...prev, ...previews].slice(0, 5));
    };

    const handleCertificationUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setCertificationPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
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

        setShowModal(true);
        console.log('Application submitted:', formData);
    };

    const closeModal = () => {
        setShowModal(false);
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
                                            name="businessName"
                                            value={formData.businessName}
                                            onChange={handleInputChange}
                                            className="w-full border border-[#a8b5b2] rounded p-2 focus:border-[#c89563] focus:ring-1 focus:ring-[#c89563] transition duration-200"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[#3d3734] mb-2">Contact Name *</label>
                                        <input
                                            type="text"
                                            name="contactName"
                                            value={formData.contactName}
                                            onChange={handleInputChange}
                                            className="w-full border border-[#a8b5b2] rounded p-2 focus:border-[#c89563] focus:ring-1 focus:ring-[#c89563] transition duration-200"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[#3d3734] mb-2">Email Address *</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full border border-[#a8b5b2] rounded p-2 focus:border-[#c89563] focus:ring-1 focus:ring-[#c89563] transition duration-200"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[#3d3734] mb-2">Phone Number *</label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
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
                                        <label className="block text-[#3d3734] mb-2">Description *</label>
                                        <input
                                            type="text"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Briefly describe your vintage business or brand"
                                            className="w-full border border-[#a8b5b2] rounded p-2 focus:border-[#c89563] focus:ring-1 focus:ring-[#c89563] transition duration-200"
                                            required
                                        />
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-[#3d3734] mb-2">
                                            Tell us the story behind your vintage item *
                                        </label>
                                        <textarea
                                            rows="5"
                                            className="w-full border border-[#a8b5b2] rounded p-2 focus:border-[#c89563] focus:ring-1 focus:ring-[#c89563] transition duration-200"
                                            placeholder="Share the history of your vintage piece — where it comes from, who owned it before, its unique story, and why it's special."
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                                        <div>
  <label className="block text-[#3d3734] mb-2">
    Category (Select one) *
  </label>
  {loadingCategories ? (
    <p className="text-sm text-gray-500">Chargement des catégories...</p>
  ) : categories.length === 0 ? (
    <p className="text-sm text-red-500">Aucune catégorie disponible</p>
  ) : (
    <div className="space-y-2">
      {categories.map((category) => (
        <label key={category.id} className="flex items-center">
          <input
            type="radio"
            name="category"
            value={category.id}
            checked={formData.categories[0] === category.id.toString()}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                categories: [e.target.value], // ✅ Une seule catégorie
              }))
            }
            className="mr-2 accent-[#c89563] focus:ring-[#4a6660]"
            required
          />
          <span>{category.nom}</span>
        </label>
      ))}
    </div>
  )}
</div>


                                        <div className="mb-4">
                                            <label className="block text-[#3d3734] mb-2">Eras (Select one) *</label>
                                            <div className="flex flex-col gap-2">
                                                {erasList.map((era) => (
                                                    <label key={era} className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            name="era"
                                                            value={era}
                                                            checked={selectedEra === era}
                                                            onChange={(e) => setSelectedEra(e.target.value)}
                                                            className="accent-[#c89563] w-4 h-4"
                                                            required
                                                        />
                                                        <span>{formatEra(era)}</span>
                                                    </label>
                                                ))}
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
                                        <span className="text-5xl">📤</span>
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
                                    <h3 className="text-lg font-semibold text-[#3d3734] pt-2">
                                        Business Documentation
                                    </h3>
                                </div>

                                <div className="ml-14">
                                    <p className="mb-3 text-sm text-[#3d3734]">
                                        Please upload a certification or document proving that your product is
                                        authentic vintage.
                                    </p>

                                    <div className="border-2 border-dashed border-[#a8b5b2] rounded-lg p-6 text-center hover:border-[#c89563] transition duration-200">
                                        <span className="text-5xl">📤</span>
                                        <p className="mt-2">
                                            Drag the file here or{" "}
                                            <label className="text-[#4a6660] underline cursor-pointer">
                                                browse files
                                                <input
                                                    type="file"
                                                    accept="image/*,.pdf"
                                                    className="hidden"
                                                    onChange={handleCertificationUpload}
                                                    required
                                                />
                                            </label>
                                        </p>
                                        <p className="text-sm mt-1 text-gray-500">
                                            Accepted formats: JPG, PNG, PDF – max 5MB
                                        </p>
                                    </div>

                                    {certificationPreview && (
                                        <div className="mt-4 flex items-center space-x-3">
                                            <img
                                                src={certificationPreview}
                                                alt="Certification preview"
                                                className="w-24 h-24 object-cover rounded border"
                                            />
                                            <p className="text-[#3d3734] text-sm">File uploaded successfully.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="ml-14 mb-8">
                                <div className="bg-[#d4b5a6] bg-opacity-20 p-4 rounded border-l-4 border-[#c89563]">
                                    <div className="flex items-start mb-4">
                                        <input
                                            type="checkbox"
                                            checked={formData.termsAccepted}
                                            onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
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
                                            checked={formData.marketingConsent}
                                            onChange={(e) => setFormData(prev => ({ ...prev, marketingConsent: e.target.checked }))}
                                            className="mt-1 mr-3 text-[#4a6660] focus:ring-[#4a6660]"
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

                        {showModal && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                <div className="bg-white p-8 rounded-lg shadow-2xl border-2 border-[#c89563] max-w-md w-full">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-[#4a6660] rounded-full mx-auto flex items-center justify-center mb-4">
                                            <span className="text-3xl text-white">✓</span>
                                        </div>
                                        <h2 className="text-xl font-bold text-[#3d3734] mb-2">Application Received!</h2>
                                        <p className="text-[#3d3734] mb-4">
                                            Thank you for applying to become a Vintagely vendor. We've received your application and
                                            will be in touch soon.
                                        </p>
                                        <p className="text-sm text-[#4a6660]">Application Reference: #VIN23789</p>
                                        <button 
                                            onClick={closeModal}
                                            className="mt-6 bg-[#c89563] text-white py-2 px-6 rounded hover:bg-[#b78553] transition duration-200"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </form>
    );
}