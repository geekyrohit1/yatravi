"use client";

import React from 'react';
import { ExternalLink, Plane, Globe, ShieldCheck } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DOMESTIC_AIRLINES = [
    { id: 'indigo', name: 'IndiGo', url: 'https://www.goindigo.in/web-check-in.html', color: '#0053CC' },
    { id: 'airindia', name: 'Air India', url: 'https://www.airindia.com/in/en/book/manage-booking/web-checkin.html', color: '#ED1B24' },
    { id: 'vistara', name: 'Vistara', url: 'https://www.airvistara.com/in/en', color: '#582436' },
    { id: 'spicejet', name: 'SpiceJet', url: 'https://www.spicejet.com/check-in', color: '#F98616' },
    { id: 'akasa', name: 'Akasa Air', url: 'https://www.akasaair.com/web-check-in', color: '#FF6400' },
    { id: 'airindiaexpress', name: 'Air India Express', url: 'https://www.airindiaexpress.com/check-in', color: '#ED1E24' }
];

const INTERNATIONAL_AIRLINES = [
    { id: 'emirates', name: 'Emirates', url: 'https://www.emirates.com/in/english/manage-booking/web-check-in/', color: '#D71921' },
    { id: 'qatar', name: 'Qatar Airways', url: 'https://wtrweb.qatarairways.com/qq/ci', color: '#5C0632' },
    { id: 'etihad', name: 'Etihad Airways', url: 'https://www.etihad.com/en-in/manage/check-in', color: '#D9B48F' },
    { id: 'singapore', name: 'Singapore Airlines', url: 'https://www.singaporeair.com/en_UK/plan-travel/check-in/', color: '#FDB913' },
    { id: 'british', name: 'British Airways', url: 'https://www.britishairways.com/travel/olcilandingpage/public/en_in', color: '#075AAA' },
    { id: 'lufthansa', name: 'Lufthansa', url: 'https://www.lufthansa.com/in/en/online-check-in', color: '#05164B' },
    { id: 'airfrance', name: 'Air France', url: 'https://www6.airfrance.co.in/en/check-in', color: '#002E5D' },
    { id: 'thai', name: 'Thai Airways', url: 'https://www.thaiairways.com/en/manage/i_checkin.page', color: '#4B0082' },
    { id: 'airasia', name: 'AirAsia', url: 'https://www.airasia.com/check-in/v2/en/gb', color: '#ED2224' },
    { id: 'united', name: 'United Airlines', url: 'https://www.united.com/en/us/checkin', color: '#005DAA' },
    { id: 'turkish', name: 'Turkish Airlines', url: 'https://www.turkishairlines.com/en-int/flights/manage-booking/check-in/', color: '#C8102E' },
    { id: 'srilankan', name: 'SriLankan Airlines', url: 'https://www.srilankan.com/en_uk/plan-and-book/online-check-in', color: '#005696' },
    { id: 'klm', name: 'KLM', url: 'https://www.klm.co.in/check-in', color: '#00A1DE' },
    { id: 'malaysia', name: 'Malaysia Airlines', url: 'https://www.malaysiaairlines.com/hq/en/plan-your-trip/check-in.html', color: '#003366' },
    { id: 'virgin', name: 'Virgin Atlantic', url: 'https://www.virginatlantic.com/en/in/manage-your-booking/check-in', color: '#E41F35' },
    { id: 'swiss', name: 'Swiss', url: 'https://www.swiss.com/in/en/book/manage/check-in', color: '#F00000' },
    { id: 'cathay', name: 'Cathay Pacific', url: 'https://www.cathaypacific.com/cx/en_IN/manage-booking/check-in.html', color: '#006564' },
    { id: 'jal', name: 'Japan Airlines', url: 'https://www.jal.co.jp/jp/en/inter/boarding/webcheckin/', color: '#CC0000' },
    { id: 'qantas', name: 'Qantas', url: 'https://www.qantas.com/in/en/travel-info/check-in.html', color: '#E30000' },
    { id: 'vietjet', name: 'VietJet', url: 'https://www.vietjetair.com/en/checkin', color: '#ED1C24' },
    { id: 'oman', name: 'Oman Air', url: 'https://www.omanair.com/en/manage-bookings/check-in', color: '#BC9B5D' },
    { id: 'saudia', name: 'Saudia', url: 'https://www.saudia.com/checkin', color: '#006C35' },
    { id: 'kuwait', name: 'Kuwait Airways', url: 'https://www.kuwaitairways.com/en/web-check-in', color: '#003399' },
    { id: 'gulf', name: 'Gulf Air', url: 'https://www.gulfair.com/manage-my-booking/web-check-in', color: '#B58500' },
];

const AirlineCard = ({ airline }: { airline: { id: string, name: string, url: string, color: string } }) => (
    <Card className="group relative overflow-hidden bg-white hover:bg-gray-50 border-gray-100 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] hover:-translate-y-1 rounded-2xl">
        <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-colors shadow-sm" style={{ backgroundColor: `${airline.color}10`, color: airline.color }}>
                    <Plane className="w-6 h-6 rotate-45" />
                </div>
                <a href={airline.url} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-brand transition-colors bg-gray-50 rounded-lg">
                    <ExternalLink className="w-4 h-4" />
                </a>
            </div>
            <h3 className="font-heading tracking-tight font-bold text-lg text-gray-900 mb-1 truncate" title={airline.name}>{airline.name}</h3>
            <p className="text-[10px] text-gray-400 font-bold mb-6">Official Check-In</p>
            <Button asChild className="w-full h-11 bg-gray-950 hover:bg-brand text-white rounded-xl font-bold text-xs transition-all shadow-md group-hover:scale-[1.02]">
                <a href={airline.url} target="_blank" rel="noopener noreferrer">Proceed Now</a>
            </Button>
        </CardContent>
        <div className="absolute bottom-0 left-0 w-full h-1" style={{ backgroundColor: airline.color }} />
    </Card>
);

export default function WebCheckInClient({ initialData }: { initialData?: any }) {
    return (
        <main className="min-h-screen bg-gray-50/50 py-24 relative overflow-hidden">
            <h1 className="sr-only">Online Flight Web Check-in - All Airlines</h1>
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand/5 to-transparent pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-20 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-xs font-medium mb-6 hover:bg-white/20 transition-colors cursor-default">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Hassle-Free Boarding</span>
                    </div>
                    <div className="font-heading tracking-tight font-bold text-4xl md:text-6xl text-gray-950">Web Check-in</div>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto font-light leading-relaxed">
                        Skip the airport queues. Select your airline below to complete your check-in securely on their official portal using your booking reference.
                    </p>
                </div>
                <div className="mb-24">
                    <div className="flex items-center justify-between gap-6 mb-10">
                        <h2 className="text-xs font-bold text-gray-400 flex items-center gap-2 shrink-0"><span className="w-8 h-px bg-gray-200" />Domestic Airlines</h2>
                        <div className="h-px bg-gray-200 flex-grow" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {DOMESTIC_AIRLINES.map((airline) => <AirlineCard key={airline.id} airline={airline} />)}
                    </div>
                </div>
                <div className="mb-20">
                    <div className="flex items-center justify-between gap-6 mb-10">
                        <h2 className="text-xs font-bold text-gray-400 flex items-center gap-2 shrink-0"><span className="w-8 h-px bg-gray-200" />International Carriers</h2>
                        <div className="h-px bg-gray-200 flex-grow" /><Globe className="w-4 h-4 text-gray-300" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {INTERNATIONAL_AIRLINES.map((airline) => <AirlineCard key={airline.id} airline={airline} />)}
                    </div>
                </div>
                <div className="mt-20 text-center pb-12 pt-12 border-t border-gray-100 flex flex-col items-center gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 inline-flex items-center gap-3 text-xs text-gray-400 font-medium">
                        <ShieldCheck className="w-4 h-4 text-brand/50" />Official Secure Redirection
                    </div>
                    <p className="text-xs text-gray-400/80 max-w-xl leading-relaxed">
                        Links point to official airline domains. Yatravi is not responsible for external content or booking failures on third-party sites. Please keep your PNR ready.
                    </p>
                </div>
            </div>
        </main>
    );
}
