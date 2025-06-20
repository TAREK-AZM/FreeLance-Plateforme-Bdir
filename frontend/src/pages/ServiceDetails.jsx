import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FormModal from "../components/FormModal";
import { Toaster, toast } from "react-hot-toast";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";

const DEFAULT_PROFILE_IMG = `${import.meta.env.VITE_FRONTEND}/assets/profile/default-profile.jpg`;

const ServiceDetails = () => {
    const { id } = useParams();
    const [service, setService] = useState({});
    const [comments, setComments] = useState([]);
    // const [users, setUsers] = useState([]);
    const token = localStorage.getItem("token");
    const fetchData = async () => {
        try {
            const serviceResponse = await axios.get(`${import.meta.env.VITE_API2}/api/prestataire/mesServices/${id}/serviceDetails`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setService(await serviceResponse.data);

            const commentsResponse = await axios.get(`${import.meta.env.VITE_API2}/api/prestataire/services/${id}/commentaires`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // const usersResponse = await axios.get(`${import.meta.env.VITE_API}/users`);

            setComments(await commentsResponse.data);
            // setUsers(await usersResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load data. Please try again.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const [isModalVisible, setModalVisible] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const handleEdit = () => {
        setIsEdit(true);
        setModalVisible(true);
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(
                `${import.meta.env.VITE_API2}/api/prestataire/mesServices/${id}/delete`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Attach token in Authorization header
                    },
                }
            );

            if (response.status === 200) {
                toast.success("Service deleted successfully!");
                setTimeout(() => {
                    window.location.href = "/prestataires/services";
                }, 3000);
            } else {
                toast.error("Failed to delete service. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting service:", error);

        }
    };


    const closeModal = () => {
        setModalVisible(false);
        setIsEdit(false);
        toast.success("Service edited successfully!");
        fetchData();
    };

    // const getUserInfo = (userId) => {
    //     const user = users.find((user) => user.id === userId);
    //     return (
    //         user || {
    //             name: "Unknown",
    //             lastName: "User",
    //             profileImg: DEFAULT_PROFILE_IMG,
    //         }
    //     );
    // };

    return (
        <div className="container mx-auto p-8">
            <Toaster position="top-center" reverseOrder={false} />

            {/* Back to Services Link */}
            <div className="flex items-center mb-6">
                <Link to="/prestataires/services" className="text-indigo-500 hover:text-indigo-600 flex items-center">
                    <FaArrowLeft className="mr-2" /> Back to my services
                </Link>
            </div>

            {/* Two-Column Layout with Proper Shadow */}
            <div className="relative bg-white rounded-lg border border-gray-400 shadow-2xl overflow-hidden flex flex-col md:flex-row">
                {/* Shadow Behind */}
                <div
                    className="absolute -top-4 left-0 w-full h-4 bg-gradient-to-b from-gray-300 to-transparent rounded-t-lg"
                    style={{ zIndex: -1 }}
                ></div>

                {/* Left Column: Image */}
                <div className="flex-1 md:w-1/2 h-auto p-4">
                    {service.image ? (
                        <img
                            src={`${import.meta.env.VITE_API2}/api${service.image}`}
                            alt={service.titre}
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center rounded-lg">
                            <span className="text-gray-500 text-lg">No image available</span>
                        </div>
                    )}
                </div>

                {/* Right Column: Service Info */}
                <div className="p-6 flex-1">
                    <h1 className="text-3xl font-bold mb-4">{service.titre}</h1>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <div className="mb-4">
                        <strong>Price:</strong> ${service.prix}
                    </div>
                    <div className="mb-4">
                        <strong>Status:</strong>{" "}
                        <span className={`text-${service.status ? "green" : "gray"}-600`}>
                            {service.status ? "Active" : "Inactive"}
                        </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4 mb-6">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                            onClick={handleEdit}
                        >
                            Edit
                        </button>
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                            onClick={handleDelete}
                        >
                            Delete
                        </button>
                    </div>

                    {/* Comments Section */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mt-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Comments</h2>
                        <hr className="my-4 border-gray-300 dark:border-gray-700" />
                        {comments.length > 0 ? (
                            <ul>
                                {comments.map((comment) => {
                                    const user = comment.client;
                                    return (
                                        <li
                                            key={comment.id}
                                            className="mb-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center space-x-4"
                                        >
                                            <img
                                                src={`${import.meta.env.VITE_API2}/api${user.imageUrl}` || DEFAULT_PROFILE_IMG}
                                                alt={`${user.prenom} ${user.nom}`}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                            <div>
                                                <Link
                                                    to={`/prestataires/user/${user.id}`}
                                                    state={{ serviceId: id }} // Pass the service ID as state
                                                    className="font-semibold text-indigo-500 hover:underline"
                                                >
                                                    {user.prenom} {user.nom}
                                                </Link>
                                                <p className="text-gray-800 dark:text-gray-300">{comment.content}</p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400">No comments yet.</p>
                        )}
                    </div>


                </div>
            </div>

            {/* Form Modal for Edit */}
            <FormModal
                isVisible={isModalVisible}
                onClose={closeModal}
                onSubmit="services"
                formData={service}
                isEdit={isEdit}
            />
        </div>
    );
};

export default ServiceDetails;
