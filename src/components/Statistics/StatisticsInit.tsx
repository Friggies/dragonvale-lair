export default function StatisticsInit() {
    return (
        <>
            <script
                data-collect-dnt="true"
                async
                src="https://scripts.simpleanalyticscdn.com/latest.js"
            ></script>
            <noscript>
                <img
                    src="https://queue.simpleanalyticscdn.com/noscript.gif?collect-dnt=true"
                    alt=""
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </noscript>
        </>
    )
}
