/**
 * @widget
 * @author zyd
 * @version 1.1
 * pager   -   分页
 * @author yingdazhu@icloud.com
 * @git github.com/zhuyingda/zippo
 * @module UMD
 * @require pager.css
 * @require jquery
 */
;(function (window, $, undefined) {
  var
    /**
     * @desc 初始化必要的dom元素
     */
    base = function () {
      return '<div class="page-box clearfix">' +
        '<div class="page-btn btn-style prev">上一页</div> ' +
        '<div class="page-wrap"> ' +
        '</div> ' +
        '<div class="page-btn btn-style next">下一页</div> ' +
        '</div>';
    },

    /**
     * @desc 当前所在页（从1开始）
     */
    curPage = 1,

    /**
     * @desc 每页显示评论数
     */
    itemInPage,

    /**
     * @desc 每页显示的翻页按钮数
     */
    btnInPage,

    /**
     * @desc 评论总条数
     */
    total = 0;

  /**
   * @desc 获取当前页
   */
  function getCurPage() {
    return curPage;
  }

  /**
   * @desc 设置总条数
   */
  function setTotal(n) {
    total = n;
    renderPager(curPage);
  }

  /**
   * @desc 排列第pageNum页的按钮列表
   * @var begin 当前页从第begin页开始
   * @var end 当前页的最后一个按钮的页数
   * @var pageLen 总页数
   * @var pagerContainer 组件容器
   */
  function renderPager(pageNum) {
    var
      begin,
      end,
      pageLen = Math.ceil(total / itemInPage) + 1,
      pagerContainer = $('.page-wrap');

    begin = beginCal(pageNum, btnInPage, pageLen);
    end = endCal(begin, btnInPage, pageLen);

    pagerContainer.empty();
    for (var i = begin; i < end; i++) {
      pagerContainer.append('<div class="page-item">' + i + '</div>');
    }
    for (i = 0; i < $('.page-item').length; i++) {
      if (pageNum == $('.page-item').eq(i).html()) {
        $('.page-item').eq(i).addClass('btn-cur');
      }
    }

    edgeCheck(pageNum, pageLen);
    curPage = pageNum;
  }

  /**
   * @desc 计算当前页翻页按钮列表的起始位和末位
   */
  function beginCal(pageNum, btns, pageLen) {
    if (pageNum <= Math.round(btns / 2)) {
      return 1;
    } else if (pageNum > Math.round(btns / 2) && Math.abs((pageLen - 1) - pageNum) >= Math.round(btns / 2)) {
      return pageNum - Math.round(btns / 2) + 1;
    } else if (Math.abs((pageLen - 1) - pageNum) < Math.round(btns / 2)) {
      if (pageLen > btns) {
        return pageLen - btns;
      } else {
        return 1;
      }
    }
  }

  function endCal(begin, btns, pageLen) {
    if (btns <= pageLen) {
      return btns + begin;
    } else {
      return pageLen + begin - 1;
    }
  }

  /**
   * @desc 按钮样式边界处理
   */
  function edgeCheck(pageNum, pageLen) {
    if (pageNum == 1) {
      $('.page-box').addClass('in-first-page').removeClass('in-last-page');
    } else if (pageNum == pageLen - 1) {
      $('.page-box').addClass('in-last-page').removeClass('in-first-page');
    } else {
      $('.page-box').removeClass('in-first-page in-last-page');
    }
  }

  /**
   * @desc 翻页回调
   */
  function onTurn(func) {
    $('.next').click(function () {
      if (!$('.page-box').hasClass('in-last-page')) {
        renderPager(++curPage);
        func(curPage);
      }
    });
    $('.prev').click(function () {
      if (!$('.page-box').hasClass('in-first-page')) {
        renderPager(--curPage);
        func(curPage);
      }
    });
    $('.page-wrap').on('click', '.page-item', function () {
      renderPager($(this).html());
      func($(this).html());
    });
  }

  /**
   * @desc 组件初始化
   */
  function init(opts) {
    var cont = base();
    opts.$el.html(cont);
    btnInPage = opts.btnInPage || 10;
    itemInPage = opts.itemInPage || 10;
    $('.page-item').click(function () {
      $(this).addClass('btn-cur').siblings().removeClass('btn-cur');
    });
    onTurn(opts.onTurn || function () {
        console.log('未绑定翻页回调')
      });
  }

  var zp = {
    pager: {
      init: init,
      getCurPage: getCurPage,
      setTotal: setTotal
    }
  };

  if(window.zp){
    window.zp = $.extend(window.zp, zp);
  }else{
    window.zp = zp;
  }
})(window, $);