import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux'
import LazyLoad, {forceCheck} from 'react-lazyload';
import Horizen from '../../baseUI/horizen-item';
import Loading from '../../baseUI/loading';
import Scroll from '../../components/scroll/index';
import { NavContainer, ListContainer, List, ListItem, EnterLoading } from "./style";

import { renderRoutes } from 'react-router-config';
// import { toJS } from 'immutable'

import { categoryTypes, alphaTypes } from '../../api/config';
import {
    getSingerList,
    getHotSingerList,
    changePullDownLoading,
    changePageCount,
    refreshMoreSingerList,
    refreshMoreHotSingerList,
    changeEnterLoading,
    changePullUpLoading
} from './store/actionCreator'
// import { CategoryDataContext, CHANGE_ALPHA, CHANGE_CATEGORY } from './data';

const mapStateToProps = (state) => ({
    singerList: state.getIn(['singers', 'singerList']),
    enterLoading: state.getIn(['singers', 'enterLoading']),
    pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
    pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
    pageCount: state.getIn(['singers', 'pageCount'])
})

const mapDispatchToProps = (dispatch) => {
    return {
        getHotSingerList() {
            dispatch(getHotSingerList())
        },
        updateDispatch(category, alpha) {
            dispatch(changePageCount(0)) // 由于改变了分类，所以pageCount清零
            dispatch(changeEnterLoading(true)) //loading，现在实现控制逻辑
            dispatch(getSingerList(category, alpha))
        },
        // 滑倒最低部刷新部分的处理
        pullUpRefreshDispatch(category, alpha, hot, count) {
            dispatch(changePullUpLoading(true));
            dispatch(changePageCount(count + 1));
            if (hot) {
                dispatch(refreshMoreHotSingerList());
            } else {
                dispatch(refreshMoreSingerList)
            }
        },
        // 顶部下拉刷新
        pullDownRefreshDispatch(category, alpha) {
            dispatch(changePullDownLoading(true));
            dispatch(changePageCount(0)); // 重新获取数据
            if (category === '' && alpha === '') {
                dispatch(getHotSingerList());
            } else {
                dispatch(getSingerList(category, alpha))
            }
        }
    }
}

// 渲染函数，返回歌手列表
const renderSingerList = (props) => {
    let { singerList } = props;
    const singerListJS = singerList ? singerList.toJS() : [];

    const enterDetail = (id) => {
        props.history.push(`/singers/${id}`)
    }

    return (
        <List>
            {
                singerListJS.map((item, index) => {
                    return (
                        <ListItem key={item.accountId + "" + index} onClick={() => enterDetail(item.id)}>
                            <div className="img_wrapper">
                                <LazyLoad placeholder={<img width="100%" height="100%" src={require ('./singer.png')} alt="music"/>}>
                                    <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music"/>
                                </LazyLoad>
                            </div>
                            <span className="name">{item.name}</span>
                        </ListItem>
                    )
                })
            }
        </List>
    )
}

function Singers(props) {
    let [category, setCategory] = useState('');
    let [alpha, setAlpha] = useState('');
    // const { data, dispatch } = useContext(CategoryDataContext)
    // const {category, alpha} = data.toJS()
    let {
        enterLoading,
        pageCount,
        pullUpLoading,
        pullDownLoading,
        singerList,
        
    } = props;
    let {
        updateDispatch,
        pullUpRefreshDispatch,
        pullDownRefreshDispatch
    } = props;

    let handleUpdataAlpha = (val) => {
        setAlpha(val);
        updateDispatch(category, alpha)
    }
    let hanldeUpdateCategory = (val) => {
        setCategory(val);
        updateDispatch(category, alpha)
    }
    //CHANGE_ALPHA 和 CHANGE_CATEGORY 变量需要从 data.js 中引入
    // let handleUpdataAlpha = (val) => {
    //     dispatch({ type: CHANGE_ALPHA, data: val })
    //     updateDispatch(category, val)
        
    // }
    // let hanldeUpdateCategory = (val) => {
    //     dispatch ({ type: CHANGE_CATEGORY, data: val});
    //     updateDispatch(val, alpha)
    // }

    const handlePullUp = () => {
        pullUpRefreshDispatch(category, alpha, category === '', pageCount)
    }

    const handlePullDown = () => {
        pullDownRefreshDispatch(category, alpha)
    }

    useEffect(() => {
        console.log(singerList)
        if (!singerList.size) {

            updateDispatch(category, alpha)     
        }
    }, [alpha, category, singerList, updateDispatch]);
    
    return (
        <div>
            <EnterLoading>
                <Loading show={enterLoading}></Loading>
            </EnterLoading>
            <NavContainer>
                <Horizen
                    list={categoryTypes}
                    title={"分类(默认热门分类):"}
                    handleClick={hanldeUpdateCategory}
                    oldVal={category}
                ></Horizen>
                <Horizen
                    list={alphaTypes}
                    title={"首字母"}
                    handleClick={handleUpdataAlpha}
                    oldVal={alpha}
                ></Horizen>
            </NavContainer>
            <ListContainer>
                <Scroll
                    pullUp={handlePullUp}
                    pullDown={handlePullDown}
                    pullUpLoading ={pullUpLoading}
                    pullDownLoading={pullDownLoading}
                    onScroll={forceCheck}
                >
                    {renderSingerList(props)}
                </Scroll>
            </ListContainer>
            {renderRoutes(props.route.routes)}
        </div> 
    )
}



export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singers));