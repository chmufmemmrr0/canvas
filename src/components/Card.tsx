import { useNavigate } from "react-router-dom";

type CardProps = {
    image: string;
    title: string;
    description: string;
    path?: string;
};

export default function Card({ image, title, description, path }: CardProps) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (path) {
            navigate(path);
            return;
        }
        navigate("/");
    };

    return (
        <button className="w-96 h-64 bg-white rounded-lg shadow-md overflow-hidden homeButton" onClick={handleClick}>
            <h2 className="card-title">{title}</h2>
            <p className="card-content">{}</p>
        </button>
    );
}