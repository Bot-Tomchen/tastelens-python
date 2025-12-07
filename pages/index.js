import Link from "next/link";

export default function Home() {
  const restaurants = [
    { 
      id: 1, 
      name: "Jahunger", 
      rating: 4.7,            // 数字
      label: "Suggested",     // 展示用
      img: "/images/jahunger1.jpg" 
    },
    { 
      id: 2, 
      name: "Den Den Korean Fried Chicken", 
      rating: 4.6,
      label: "Preferred", 
      img: "/images/denden1.jpg" 
    },
    { 
      id: 3, 
      name: "Feedbacks (TasteLens Team)", 
      rating: 4.5,
      label: "Anniversary-Worthy", 
      img: "/images/Tastelens.jpg" 
    },
  ];

  return (
    <div className="min-h-screen bg-[#faf7f2] p-5">
      <h1 className="text-2xl font-bold text-center mb-6 text-[#4a3a2e]">
        Nearby restaurant
      </h1>

      <div className="space-y-4">
        {restaurants.map((r) => (
          <Link key={r.id} href={`/restaurant/${r.id}`} className="block">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#f0ebe3] cursor-pointer hover:shadow-md transition-shadow duration-150">

              <div className="relative w-full h-28 overflow-hidden rounded-xl mb-3 bg-[#f5f0e8]">
                <img
                  src={r.img}
                  alt={r.name}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
              </div>

              <div className="text-xl font-semibold text-[#4a3a2e]">
                {r.name}
              </div>
              <div className="text-[#a8712a] font-medium mt-1">
                {r.label}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
