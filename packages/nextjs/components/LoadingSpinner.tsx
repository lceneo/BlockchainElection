
export default function LoadingSpinner() {
    return (
        <>
            <div className="flex flex-col flex-grow justify-center items-center w-full">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="font-bold text-xl">Is Loading...</p>
            </div>
        </>
    )
}
