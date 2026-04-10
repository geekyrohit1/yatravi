export default function Loading() {
    // Return a minimalistic loading state to prevent hard white flashes 
    // while the TopLoader handles the primary visual feedback.
    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none bg-white/10 backdrop-blur-[2px] flex items-center justify-center opacity-0 animate-pulse transition-opacity duration-300">
            {/* Minimal ghost loader if needed, otherwise leave empty */}
        </div>
    );
}
