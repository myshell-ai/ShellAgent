import { useCallback, useEffect, useRef } from 'react';
import { useScroll, useToggle } from 'react-use';

/**
 * 内部逻辑, 布局相关, 目前无需求需变更相关代码, 沿用了 chat@v2 逻辑, 不暴露给用户. 主要实现逻辑见 Chat Background.
 */
export default function useRoomLayout() {
  // 滚动容器的 ref，监听滚动位置，计算是否需要吸顶
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // 编辑器容器的 ref，监听到顶部的距离，计算是否需要吸顶
  const editorContainerRef = useRef<HTMLDivElement>(null);
  // 滚动吸顶时的占位容器 Ref
  const editorAnchorRef = useRef<HTMLDivElement>(null);
  // 滚动吸顶时控制输入框 blur 的 ref 引用
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // 聊天 container
  const chatContainerRef = useRef<HTMLDivElement>(null);
  // detailContainerRef，目的是为了 pc/mobile 兼容
  const detailContainerRef = useRef<HTMLDivElement>(null);
  const detailScrollRef = useRef<HTMLDivElement>(null);

  const { y: detailScrollY } = useScroll(detailScrollRef);

  const [isEditorSticky, setIsEditorSticky] = useToggle(false);
  const [contentActive, setContentActive] = useToggle(true);

  // 进入输入模式时的滚动逻辑
  const scrollLayoutToTop = useCallback(() => {
    if (!scrollContainerRef.current) return;

    scrollContainerRef.current.scrollTop = 0;
  }, []);

  const manuallyScrollDetailToTop = useCallback(() => {
    if (!editorContainerRef.current || !scrollContainerRef.current) return;

    // 获取 editorContainer 相对于视口的位置
    const editorRect = editorContainerRef.current.getBoundingClientRect();
    // 获取 scrollContainer 相对于视口的位置
    const scrollContainerRect =
      scrollContainerRef.current.getBoundingClientRect();

    // 计算 editorContainer 相对于 scrollContainer 的顶部距离
    // 这是通过减去两个元素的顶部距离视口的位置来获得的
    const relativeTop = editorRect.top - scrollContainerRect.top;

    // 设置滚动容器的 scrollTop 值
    // 由于 relativeTop 已经是相对位置，我们只需将其添加到当前的 scrollTop
    scrollContainerRef.current.scrollTop = Math.ceil(
      scrollContainerRef.current.scrollTop + relativeTop,
    );
  }, [editorContainerRef, scrollContainerRef]);

  const showMobileDetail = useCallback(() => {
    setContentActive(false);
  }, [setContentActive]);

  useEffect(() => {
    let animationFrameId: number;
    const scrollContainerEle = scrollContainerRef.current;

    const handleScroll = () => {
      cancelAnimationFrame(animationFrameId);

      animationFrameId = requestAnimationFrame(() => {
        if (
          scrollContainerEle &&
          editorContainerRef.current &&
          editorAnchorRef.current
        ) {
          const scrollContainerRect =
            scrollContainerEle.getBoundingClientRect();
          const anchorRect = editorAnchorRef.current.getBoundingClientRect();

          const topDistance = anchorRect.top - scrollContainerRect.top;
          const shouldSticky = topDistance <= 0;

          if (shouldSticky !== isEditorSticky) {
            setIsEditorSticky(shouldSticky);

            if (shouldSticky) {
              const editorHeight = editorContainerRef.current.offsetHeight;
              editorAnchorRef.current.style.height = `${editorHeight}px`;

              editorContainerRef.current.style.position = 'absolute';
              editorContainerRef.current.style.borderBottom =
                '1px solid var(--border)';
              editorContainerRef.current.style.boxShadow =
                '0px 20px 20px -10px var(--shadow-modal-bolder)';
              textareaRef.current?.blur();
            } else {
              // 当不是 sticky 状态时，移除 anchor 的高度设置，让它自然流动
              editorAnchorRef.current.style.height = 'auto';

              editorContainerRef.current.style.position = 'static';
              editorContainerRef.current.style.borderBottom = 'none';
              editorContainerRef.current.style.boxShadow = 'none';
            }
          }
        }
      });
    };

    if (scrollContainerEle) {
      scrollContainerEle.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollContainerEle) {
        scrollContainerEle.removeEventListener('scroll', handleScroll);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, [isEditorSticky]);

  return {
    scrollContainerRef,
    editorContainerRef,
    editorAnchorRef,
    textareaRef,
    chatContainerRef,
    detailContainerRef,
    detailScrollRef,
    scrollLayoutToTop,
    manuallyScrollDetailToTop,
    isEditorSticky,
    contentActive,
    setContentActive,
    detailScrollY,
    showMobileDetail,
  };
}
