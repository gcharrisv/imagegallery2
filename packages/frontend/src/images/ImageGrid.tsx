import { Link } from "react-router-dom";
import type { IApiImageData } from "../../../backend/src/common/ApiImageData.ts";
import "./Images.css";

interface IImageGridProps {
  images: IApiImageData[];
}

export function ImageGrid(props: IImageGridProps) {
  return (
    <div className="ImageGrid">
      {props.images.map((image) => (
        <div key={image.id} className="ImageGrid-photo-container">
          <Link to={`/images/${image.id}`}>
            <img src={image.src} alt={image.name} />
          </Link>
        </div>
      ))}
    </div>
  );
}

