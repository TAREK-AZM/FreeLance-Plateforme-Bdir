import { Heart } from "lucide-react";
import {Link} from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API2; // Environment variable for API base URL

export default function FreelancerCard({ freelancer, isListView }) {
  return (
    <div
      className={`relative rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md ${
        isListView ? "flex items-center gap-6" : "flex flex-col"
      }`}
    >
      {/* Favorite Icon */}
      <button className="absolute right-4 top-4 rounded-full p-1.5 hover:bg-gray-100">
        <Heart className="h-5 w-5 text-gray-400" />
      </button>

      {/* Profile Image */}
      <div className="relative h-24 w-24 flex-shrink-0 mb-12">
        <img
          src={BASE_URL+"/api"+freelancer.imageUrl || "/placeholder.svg"}
          alt={freelancer.nom}
          fill
          className="rounded-full object-cover"
        />
      </div>

      {/* Freelancer Info */}
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{freelancer.prenom}</h3>
        <p className="text-sm text-gray-600">{freelancer.description}</p>

        <div className="mt-1 flex items-center gap-2">
          {/* <span className="text-sm font-medium">{freelancer.rating.toFixed(1)}/5</span> */}
          {/* <span className="text-sm text-gray-500">({freelancer.reviews})</span> */}
        </div>

        {/* Description (Only in List View) */}
        {isListView && <p className="mt-2 text-sm text-gray-600">{freelancer?.description}</p>}

        {/* Skills */}
        <div className="mt-3 flex flex-wrap gap-2">
          {freelancer.competences.slice(0, 4).map((c) => (
            <span key={c.id} className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
              {c.name}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="mt-4 flex gap-2">
          {/* <Link  href={`/freelancers/${freelancer.name}`}> */}
          <Link  to={`/client/freelancers/1`}>
            <button className="border rounded-full px-4 py-2 text-green-600 hover:bg-green-100">
              View profile
            </button>
          </Link>
          <button className="bg-green-600 text-white rounded-full px-4 py-2">
            Invite to job
          </button>
        </div>
      </div>
    </div>
  );
}
