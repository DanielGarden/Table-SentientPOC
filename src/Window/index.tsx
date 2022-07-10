import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

export type WindowProps = {
    RowRender: (arg: { index: number }) => ReactNode
    Header?: ReactNode
    Footer?: ReactNode
    rowHeight?: number
    totalItems?: number
    children: ReactNode
}
const windowHeight = 400

export const Window: React.FC<WindowProps> = ({ rowHeight = 28, totalItems = 400, RowRender, children }) => {
    const windowRef = useRef(null)
    const [[startInd, endInd], setCurrentRange] = useState([0, Math.ceil(windowHeight / rowHeight)])
    const onScroll = useCallback((e) => {
        let firstInd = Math.floor(e.target.scrollTop / rowHeight) - 5
        let lastInd = Math.ceil((e.target.scrollTop + windowHeight) / rowHeight) + 5
        if (firstInd < 0) firstInd = 0
        if (lastInd > totalItems - 1) lastInd = totalItems - 1
        if (startInd !== firstInd || endInd !== lastInd) setCurrentRange([firstInd, lastInd])
    }, [])

    useEffect(() => {
        const ele = windowRef.current
        ele?.addEventListener('scroll', onScroll)

        return () => ele?.removeEventListener('scroll', onScroll)
    }, [onScroll])

    return (
        <div className="Window" ref={windowRef} >
            <div className="Window-inner" style={{ height: `${totalItems * rowHeight}px`, paddingTop: `${startInd * rowHeight}px` }}>
                {Array(endInd - startInd).fill(null).map((e, i) => RowRender({ index: i + startInd }))}
            </div>
        </div>
    );
}