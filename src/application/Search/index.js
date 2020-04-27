import React from 'react';
import { CSSTransition } from 'react-transition-group'
import { useState, useEffect, useCallback } from 'react';
import SearchBox from './../../baseUI/search-box/index';
import { connect } from 'react-redux'
import { getHotKeyWords, changeEnterLoading, getSuggestList } from './store/actionCreators';
import { Container, ShortcutWrapper, HotKey } from './style';
import Scroll from '../../components/scroll';
import Loading from './../../baseUI/loading/index';
import LazyLoad, {forceCheck} from 'react-lazyload';
import { List, ListItem } from './style';

function Serach(props) {
    const {
        hotList, 
        enterLoading, 
        suggestList: immutableSuggestList, 
        songsCount, 
        songsList: immutableSongsList
      } = props;
      
      const suggestList = immutableSuggestList.toJS ();
    const songsList = immutableSongsList.toJS();
    
    const {
        getHotKeyWordsDispatch,
        changeEnterLoadingDispatch,
        getSuggestListDispatch,
        getSongDetailDispatch
      } = props;
      
    const [show, setShow] = useState(false);
    const [query, setQuery] = useState ('');
    useEffect(() => {
        setShow(true)
        if (!hotList.size)
        getHotKeyWordsDispatch ();
    }, [getHotKeyWordsDispatch, hotList.size]);

    const searchBack = useCallback(() => {
        setShow(false)
    }, [])
    const handleQuery = (q) => {
        setQuery(q);
        if (!q) return;
        changeEnterLoadingDispatch (true);
        getSuggestListDispatch (q);
    }
    const renderHotKey = () => {
        let list = hotList ? hotList.toJS (): [];
        return (
          <ul>
            {
              list.map (item => {
                return (
                  <li className="item" key={item.first} onClick={() => setQuery (item.first)}>
                    <span>{item.first}</span>
                  </li>
                )
              })
            }
          </ul>
        )
    };

    
    
    const renderSingers = () => {};
    const renderAlbum = () => {};
    const renderSongs = () => {};
    return (
        <CSSTransition
            in={show}
            timeout={300}
            appear={true}
            classNames='fly'
            unmountOnExit
            onExited={() => props.history.goBack()}
            
        >
            <Container>
                
                <div className="search_box_wrapper">
                    <SearchBox back={searchBack} newQuery={query} handleQuery={handleQuery}></SearchBox>
                </div>
                <ShortcutWrapper show={!query}>
                    <Scroll>
                        <div>
                        <HotKey>
                            <h1 className="title"> 热门搜索 </h1>
                            {renderHotKey ()}
                        </HotKey>
                        </div>
                    </Scroll>
                </ShortcutWrapper>
                <ShortcutWrapper show={query}>
                    <Scroll onScorll={forceCheck}>
                        <div>
                        {renderSingers ()}
                        {renderAlbum ()}
                        {renderSongs ()}
                        </div>
                    </Scroll>
                </ShortcutWrapper>
                { enterLoading? <Loading></Loading> : null }
            </Container>

        </CSSTransition>
    )
}

const mapStateToProps = (state) => ({
    hotList: state.getIn(['search, hotList']),
    enterLoading: state.getIn (['search', 'enterLoading']),
    suggestList: state.getIn (['search', 'suggestList']),
    songsCount: state.getIn (['player', 'playList']).size,
    songsList: state.getIn (['search', 'songsList'])
})

const mapDispatchToProps = (dispatch) => {
    return {
        getHotKeyWordsDispatch () {
            dispatch (getHotKeyWords());
        },
        changeEnterLoadingDispatch (data) {
            dispatch (changeEnterLoading(data))
        },
        getSuggestListDispatch (data) {
            dispatch (getSuggestList(data));
        },
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Serach));