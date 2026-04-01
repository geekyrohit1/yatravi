import React from 'react';
import Image from 'next/image';
import { MapPin, Quote } from 'lucide-react';

const STORIES = [
    {
        id: 1,
        image: '/images/placeholder.svg',
        location: 'Cinque Terre, Italy',
        user: 'Anjali & Rohit, Mumbai',
        quote: 'We wanted a hassle-free honeymoon, and Yatravi delivered exactly that. Every hotel and transfer was spot on.',
        height: 'h-64'
    },
    {
        id: 2,
        image: '/images/placeholder.svg',
        location: 'Venice, Italy',
        user: 'The Mehra Family, Delhi',
        quote: 'Traveling with kids can be stressful, but the itinerary was perfectly paced. Venice was magical!',
        height: 'h-80'
    },
    {
        id: 3,
        image: '/images/placeholder.svg',
        location: 'Lucerne, Switzerland',
        user: 'Sarah & Friends, Bangalore',
        quote: 'Best girls trip ever! The local recommendation for fondue was the highlight of our trip.',
        height: 'h-52'
    },
    {
        id: 4,
        image: '/images/placeholder.svg',
        location: 'Bali, Indonesia',
        user: 'Rahul M., Pune',
        quote: 'Solo travel made easy. I felt safe and supported throughout the entire journey. Unforgettable experience.',
        height: 'h-80'
    },
    {
        id: 5,
        image: '/images/placeholder.svg',
        location: 'Cappadocia, Turkey',
        user: 'Priya & Vikram, Hyderabad',
        quote: 'The hot air balloon ride was a dream come true. Excellent coordination by the team.',
        height: 'h-64'
    },
];

export const TravelerStories: React.FC = () => {
    return (
        <section className="py-8 md:py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-1 h-5 md:h-6 bg-brand rounded-full"></div>
                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900 py-1">
                            Happiest Travelers
                        </h2>
                    </div>
                    <p className="text-gray-500 text-[10px] md:text-xs max-w-sm text-center font-medium">Real stories from our community of wanderers</p>
                </div>

                {/* Simple Masonry-like Grid for Responsive */}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                    {STORIES.map((story) => (
                        <div key={story.id} className={`relative group break-inside-avoid rounded-xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-500`}>
                            <div className="relative w-full h-full">
                                <Image
                                    src={story.image}
                                    alt={story.location}
                                    width={400} // Approximate width for masonry column
                                    height={600} // Tall enough for vertical cover
                                    quality={100}
                                    className="w-full object-cover shrink-0 rounded-xl"
                                />
                            </div>

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    <div className="flex items-start gap-2 text-white/90 mb-2">
                                        <Quote className="w-4 h-4 text-brand fill-current" />
                                        <p className="text-sm italic">{story.quote}</p>
                                    </div>
                                    <div className="flex justify-between items-end border-t border-white/20 pt-2 mt-2">
                                        <div>
                                            <p className="text-white font-medium text-sm">{story.user}</p>
                                            <div className="flex items-center gap-1 text-[#FFA896] text-xs">
                                                <MapPin className="w-3 h-3" /> {story.location}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
