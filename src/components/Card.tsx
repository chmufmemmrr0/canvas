type CardProps = {
    image: string;
    title: string;
    description: string;
};

export default function Card({ image, title, description }: CardProps) {
    return (
        <div className="w-96 h-64 bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="card-title">{title}</h2>
            <p className="card-content">{}</p>
        </div>
    );
}