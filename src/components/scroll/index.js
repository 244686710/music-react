import React, { forwardRef, useState, useRef, useEffect, useImperativeHandle, useMemo } from "react";
import PropTypes from 'prop-types';
import BScroll from 'better-scroll';
import styled from 'styled-components'
import style from '../../assets/global-style'
import Loading from '../../baseUI/loading/index';
import LoadingV2 from '../../baseUI/loading-v2/index';
import { debounce } from '../../api/utils'
  
// 千万注意，这里不能省略依赖，
// 不然拿到的始终是第一次 pullUp 函数的引用，相应的闭包作用域变量都是第一次的，产生闭包陷阱。下同。

const ScrollContainer = styled.div`
    width: 100%;
    height: 100%;
    overflow: hidden;
    .before {
        position: absolute;
        top: -300px;
        height: 400px;
        width: 100%;
        background: ${style["theme-color"]};
    }
`;
const PullUpLoading = styled.div``;
const PullDownLoading = styled.div``;

const Scroll = forwardRef((props, ref) => {
    const [bScroll, setBScroll] = useState();

    const scrollContainerRef = useRef();

    const { direction, click, refresh, bounceTop, bounceBottom, pullUpLoading, pullDownLoading } = props;

    const { pullUp, pullDown, onScroll } = props;

    let pullUpDebounce = useMemo(() => {
        return debounce(pullUp, 300)
    }, [pullUp]);
    let pullDownDebounce = useMemo (() => {
        return debounce (pullDown, 300)
    }, [pullDown]);

    useEffect(() => {
        const scroll = new BScroll(scrollContainerRef.current, {
            scrollX: direction === 'horizental',
            scrollY: direction === 'vertical',
            probeType: 3,
            click: click,
            bounce: {
                top: bounceTop,
                bottom: bounceBottom
            }
        });
        setBScroll(scroll);
        return () => {
            setBScroll()
        }

    }, [bounceBottom, bounceTop, click, direction]);

    useEffect(() => {
        if (!bScroll || !onScroll) return;
        bScroll.on('scroll', (scroll) => {
            onScroll(scroll);
        })
        return () => {
            bScroll.off('scroll')
        }
    }, [onScroll, bScroll]);

    // 滑动到底部
    useEffect (() => {
        if (!bScroll || !pullUp) return;
        const handlePullUp = () => {
            // 判断是否滑动到底部
            if (bScroll.y <= bScroll.maxScrollY + 100) {
                pullUpDebounce();
            }
        }; 
        bScroll.on('scrollEnd', handlePullUp);
        // 解绑
        return () => {
          bScroll.off ('scrollEnd', handlePullUp);
        }
    }, [bScroll, pullUp, pullUpDebounce]);
    
    // 判断用户下拉动作
    useEffect (() => {
        if (!bScroll || !pullDown) return;
        const handlePullDown = (pos) => {
            if (pos.y > 50) {
                pullDownDebounce();
            }
        };
        bScroll.on ('touchEnd', handlePullDown);
        return () => {
          bScroll.off ('touchEnd', handlePullDown);
        }
    }, [pullDown, bScroll, pullDownDebounce]);

    useEffect(() => {
        if (refresh && bScroll) {
            bScroll.refresh()
        }
    });

    useImperativeHandle(ref, () => ({
        refresh() {
            if (bScroll) {
                bScroll.refresh()
                bScroll.scrollTo(0, 0)
            }
        },
        getBScroll() {
            if (bScroll) {
                return bScroll;
            }
        }
    }));

    const PullUpdisplayStyle = pullUpLoading ? { display: '' } : { display: "none" };
    const PullDowndisplayStyle = pullDownLoading ? { display: '' } : { display: 'none' };

    return (
        <ScrollContainer ref={scrollContainerRef}>
            {props.children}
            {/* 滑动底部加载动画 */}
            <PullUpLoading style={PullUpdisplayStyle}>
                <Loading></Loading>
            </PullUpLoading> 
             <PullDownLoading style={PullDowndisplayStyle}>
                <LoadingV2></LoadingV2>
            </PullDownLoading>  
        </ScrollContainer>
    );

}) 

Scroll.defaultProps = {
    direction: "vertical",
    click: true,
    refresh: true,
    onScroll:null,
    pullUpLoading: false,
    pullDownLoading: false,
    pullUp: null,
    pullDown: null,
    bounceTop: true,
    bounceBottom: true
};
  
Scroll.propTypes = {
    direction: PropTypes.oneOf (['vertical', 'horizental']),
    refresh: PropTypes.bool,
    onScroll: PropTypes.func,
    pullUp: PropTypes.func,
    pullDown: PropTypes.func,
    pullUpLoading: PropTypes.bool,
    pullDownLoading: PropTypes.bool,
    bounceTop: PropTypes.bool,// 是否支持向上吸顶
    bounceBottom: PropTypes.bool// 是否支持向上吸顶
  };

export default React.memo(Scroll);