import React, { useEffect } from 'react';
import { connect } from 'react-redux'
import {getRankList} from './store/index'
import { EnterLoading } from './../Singers/style';
import { filterIndex } from '../../api/utils';
import { renderRoutes } from 'react-router-config';
import { Container, List, ListItem, SongList } from './style'
import Scroll from '../../components/scroll';
import Loading from '../../baseUI/loading/index';

function Rank(props) {
    const { rankList:list, loading, songsCount } = props;
    const { getRankListDataDispatch } = props;
    let rankList = list ? list.toJS() : [];
    let globalStartIndex = filterIndex (rankList);
    let officialList = rankList.slice (0, globalStartIndex);
    let globalList = rankList.slice(globalStartIndex);
    useEffect(() => {
        getRankListDataDispatch();
    }, [getRankListDataDispatch]);

    const renderSongList = (list) => {
        return list.length ? (
            <SongList>
                {
                    list.map((item, index) => {
                        return <li key={index}>{index + 1}. {item.first} - {item.second}</li>
                    })
                }
            </SongList>
        ) : null;
    }

    const enterDetail = (detail) => {
        props.history.push(`/rank/${detail.id}`)
    }

    const renderRankList = (list, global) => {
        return (
            <List globalRank={global}>
                {
                    list.map(item => {
                        return (
                            <ListItem key={item.coverImgId} tracks={item.tracks} onClick={() => {
                                enterDetail(item)
                            }}>
                                <div className="img_wrapper">
                                <img src={item.coverImgUrl} alt=""/>
                                <div className="decorate"></div>
                                <span className="update_frequecy">{item.updateFrequency}</span>
                                </div>
                                { renderSongList (item.tracks)  }
    
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    }

    // 榜单数据未加载出来之前都给隐藏
    let displayStyle = loading ? { "display": "none" } : { "display": "" };

    return (
        <Container play={songsCount}>
            <Scroll>
                <div>
                    <h1 className="offical" style={displayStyle}>官方版</h1>
                    {renderRankList(officialList)}
                    <h1 className="global" style={displayStyle}>全球榜</h1>
                    {renderRankList(globalList, true)}
                    {
                        loading ? <EnterLoading><Loading></Loading></EnterLoading> : null
                    }
                </div>
            </Scroll>
            {renderRoutes(props.route.routes)}
        </Container>
    )
}

// 映射 Redux 全局的 state到组件 props上
const mapStateToProps = (state) => ({
    rankList: state.getIn(['rank', 'rankList']),
    loading: state.getIn(['rank', 'loading']),
    songsCount: state.getIn(['player', 'playList']).size
})

// 映射 dispatch 到 props上
const mapDispatchToState = (dispatch) => {
    return {
        getRankListDataDispatch() {
            dispatch(getRankList());
        }
    }
};
export default connect(mapStateToProps, mapDispatchToState)(React.memo(Rank));