import React, { useState, useEffect } from 'react';
import { SliderContainer } from './style';
import "swiper/css/swiper.css";
import Swiper from 'swiper';

function Slider(props) {
    const [sliderSwiper, setSliderSwiper] = useState(null);
    const { bannerList } = props;
    
    useEffect(() => {
        // effect 的条件执行,  可以给 useEffect 传递第二个参数，它是 effect 所依赖的值数组
        if (bannerList.length && !sliderSwiper) {
            let sliderSwiper = new Swiper(".slider-container", {
                loop: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
                pagination: { el: '.swiper-pagination' },
            });
            setSliderSwiper(sliderSwiper)
        }
    }, [bannerList.length, sliderSwiper])

    return (
        <SliderContainer>
            <div className="before"></div>
            <div className="slider-container">
                <div className="swiper-wrapper">
                    {
                        bannerList.map((slider, index) => {
                            return (
                                <div className="swiper-slide" key={slider.imageUrl + index}>
                                    <div className="slider-nav">
                                        <img src={slider.imageUrl} width="100%" height="100%" alt="推荐"/>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="swiper-pagination"></div>
            </div>
        </SliderContainer>
    )
}

// React.memo 如果你的函数组件在给定相同 props 的情况下渲染相同的结果，那么你可以通过将其包装在 React.memo 中调用，以此通过记忆组件渲染结果的方式来提高组件的性能表现。这意味着在这种情况下，React 将跳过渲染组件的操作并直接复用最近一次渲染的结果。React.memo 仅检查 props 变更。如果函数组件被 React.memo 包裹，且其实现中拥有 useState 或 useContext 的 Hook，当 context 发生变化时，它仍会重新渲染。
export default React.memo(Slider);