"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Code, Eye, Edit3 } from "lucide-react";
import { normalizeEditorJsData, parseEditorJsContent, renderEditorJsToHtml } from "@/lib/cms/editorjs-content";

const EMPTY_EDITOR_DATA = normalizeEditorJsData({ blocks: [] });

function hasContent(data) {
  return Array.isArray(data?.blocks) && data.blocks.length > 0;
}

function toListItem(content = "", children = []) {
  return {
    content: String(content || ""),
    meta: {},
    items: Array.isArray(children) ? children : [],
  };
}

function getElementTagName(node) {
  if (!node || node.nodeType !== 1 || !node.tagName) {
    return "";
  }
  return node.tagName.toLowerCase();
}

function collectListItemContent(listItemNode) {
  const chunks = [];
  const childNodes = Array.from(listItemNode?.childNodes || []);

  childNodes.forEach((childNode) => {
    if (childNode.nodeType === 3) {
      chunks.push(childNode.textContent || "");
      return;
    }

    if (childNode.nodeType !== 1) {
      return;
    }

    const childTag = getElementTagName(childNode);
    if (childTag === "ul" || childTag === "ol") {
      return;
    }

    if ("outerHTML" in childNode) {
      chunks.push(childNode.outerHTML || "");
    } else {
      chunks.push(childNode.textContent || "");
    }
  });

  return chunks.join("").trim();
}

function listElementToItems(listNode) {
  const nodes = Array.from(listNode?.children || []);
  return nodes
    .filter((node) => getElementTagName(node) === "li")
    .map((node) => {
      const nestedListNode = Array.from(node.children || []).find((childNode) => {
        const nestedTag = getElementTagName(childNode);
        return nestedTag === "ul" || nestedTag === "ol";
      });

      return toListItem(
        collectListItemContent(node),
        nestedListNode ? listElementToItems(nestedListNode) : []
      );
    })
    .filter((item) => item.content || item.items.length);
}

function htmlToEditorJsData(htmlInput) {
  const source = String(htmlInput || "").trim();
  if (!source) {
    return normalizeEditorJsData({ blocks: [] });
  }

  if (typeof window === "undefined" || typeof window.DOMParser === "undefined") {
    return normalizeEditorJsData({
      blocks: [{ type: "paragraph", data: { text: source } }],
    });
  }

  const parser = new window.DOMParser();
  const doc = parser.parseFromString(`<div>${source}</div>`, "text/html");
  const root = doc.body.firstElementChild || doc.body;
  const blocks = [];
  const nodes = Array.from(root.childNodes || []);

  nodes.forEach((node) => {
    if (node.nodeType === 3) {
      const text = String(node.textContent || "").trim();
      if (text) {
        blocks.push({ type: "paragraph", data: { text } });
      }
      return;
    }

    if (node.nodeType !== 1) {
      return;
    }

    const tag = getElementTagName(node);

    if (!tag) {
      return;
    }

    if (tag === "hr") {
      blocks.push({ type: "delimiter", data: {} });
      return;
    }

    if (tag === "pre") {
      const code = String(node.textContent || "").trim();
      if (code) {
        blocks.push({ type: "code", data: { code } });
      }
      return;
    }

    if (tag === "blockquote") {
      const text = String(node.innerHTML || "").trim();
      const captionNode = node.querySelector("cite");
      const caption = String(captionNode?.textContent || "").trim();
      if (text || caption) {
        blocks.push({
          type: "quote",
          data: {
            text,
            caption,
            alignment: "left",
          },
        });
      }
      return;
    }

    if (tag === "ul" || tag === "ol") {
      const items = listElementToItems(node);
      if (items.length) {
        blocks.push({
          type: "list",
          data: {
            style: tag === "ol" ? "ordered" : "unordered",
            items,
          },
        });
      }
      return;
    }

    if (/^h[1-6]$/.test(tag)) {
      const level = Number(tag.slice(1));
      const text = String(node.innerHTML || "").trim();
      if (text) {
        blocks.push({
          type: "header",
          data: {
            text,
            level,
          },
        });
      }
      return;
    }

    const paragraphText = String(node.innerHTML || "").trim();
    if (paragraphText) {
      blocks.push({
        type: "paragraph",
        data: { text: paragraphText },
      });
    }
  });

  if (!blocks.length) {
    blocks.push({ type: "paragraph", data: { text: source } });
  }

  return normalizeEditorJsData({ blocks });
}

function EditorToolbar({ showPreview, isPreview, onTogglePreview }) {
  if (!showPreview) {
    return null;
  }

  return (
    <div className="border-b border-border bg-muted/30 p-2 flex justify-end">
      <button
        type="button"
        onClick={onTogglePreview}
        className={`p-2 rounded transition-colors ${
          isPreview ? "bg-accent text-accent-foreground" : "hover:bg-secondary/60"
        }`}
        title={isPreview ? "Edit" : "Preview"}
      >
        {isPreview ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Start writing...",
  height = "400px",
  showPreview = false,
}) {
  const holderId = useId().replace(/:/g, "");
  const editorRef = useRef(null);
  const onChangeRef = useRef(onChange);
  const isSyncingFromValueRef = useRef(false);
  const lastSyncedValueRef = useRef(typeof value === "string" ? value : JSON.stringify(value || EMPTY_EDITOR_DATA));
  const [isReady, setIsReady] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [fallbackHtml, setFallbackHtml] = useState("");
  const [editorDataForPreview, setEditorDataForPreview] = useState(EMPTY_EDITOR_DATA);

  const parsedEditorData = useMemo(() => parseEditorJsContent(value), [value]);
  const initialValueRef = useRef(value);
  const initialParsedEditorDataRef = useRef(parsedEditorData);
  const legacyHtml = useMemo(() => {
    if (parsedEditorData) {
      return "";
    }
    return String(value || "").trim();
  }, [parsedEditorData, value]);

  const previewHtml = useMemo(() => {
    if (parsedEditorData) {
      return renderEditorJsToHtml(parsedEditorData);
    }

    if (isReady && hasContent(editorDataForPreview)) {
      return renderEditorJsToHtml(editorDataForPreview);
    }

    return fallbackHtml || legacyHtml;
  }, [fallbackHtml, isReady, editorDataForPreview, legacyHtml, parsedEditorData]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let isMounted = true;
    let editorInstance = null;

    async function initEditor() {
      const [{ default: EditorJS }, { default: Header }, { default: EditorjsList }, { default: Quote }, { default: CodeTool }, { default: Delimiter }] =
        await Promise.all([
          import("@editorjs/editorjs"),
          import("@editorjs/header"),
          import("@editorjs/list"),
          import("@editorjs/quote"),
          import("@editorjs/code"),
          import("@editorjs/delimiter"),
        ]);

      if (!isMounted) {
        return;
      }

      const initialData = initialParsedEditorDataRef.current || htmlToEditorJsData(initialValueRef.current);

      editorInstance = new EditorJS({
        holder: holderId,
        data: initialData,
        placeholder,
        autofocus: false,
        inlineToolbar: true,
        tools: {
          header: {
            class: Header,
            inlineToolbar: true,
            config: {
              levels: [2, 3, 4],
              defaultLevel: 2,
              placeholder: "Heading",
            },
          },
          list: {
            class: EditorjsList,
            inlineToolbar: true,
            config: {
              defaultStyle: "unordered",
            },
          },
          quote: {
            class: Quote,
            inlineToolbar: true,
            config: {
              quotePlaceholder: "Quote",
              captionPlaceholder: "Author",
            },
          },
          code: {
            class: CodeTool,
            config: {
              placeholder: "Paste code here...",
            },
          },
          delimiter: Delimiter,
        },
        onReady: () => {
          if (!isMounted) {
            return;
          }

          editorRef.current = editorInstance;
          setIsReady(true);
          setEditorDataForPreview(normalizeEditorJsData(initialData));
          lastSyncedValueRef.current =
            typeof initialValueRef.current === "string"
              ? initialValueRef.current
              : JSON.stringify(initialValueRef.current || EMPTY_EDITOR_DATA);

          const holderElement = document.getElementById(holderId);
          if (holderElement) {
            holderElement.setAttribute("dir", "ltr");
            holderElement.style.direction = "ltr";
            holderElement.style.textAlign = "left";
          }
        },
        onChange: async () => {
          if (!editorRef.current || isSyncingFromValueRef.current) {
            return;
          }

          try {
            const output = normalizeEditorJsData(await editorRef.current.save());
            const serialized = JSON.stringify(output);
            setEditorDataForPreview(output);
            setFallbackHtml(renderEditorJsToHtml(output));
            lastSyncedValueRef.current = serialized;
            onChangeRef.current?.(serialized);
          } catch {
            // Ignore save errors while typing. Editor.js can throw during incomplete block edits.
          }
        },
      });
    }

    void initEditor();

    return () => {
      isMounted = false;
      const instance = editorRef.current;
      editorRef.current = null;
      setIsReady(false);

      if (instance?.destroy) {
        instance.destroy();
      } else if (editorInstance?.destroy) {
        editorInstance.destroy();
      }
    };
  }, [holderId, placeholder]);

  useEffect(() => {
    if (!isReady || !editorRef.current) {
      return;
    }

    const incomingValue = typeof value === "string" ? value : JSON.stringify(value || EMPTY_EDITOR_DATA);
    if (incomingValue === lastSyncedValueRef.current) {
      return;
    }

    const nextData = parsedEditorData || htmlToEditorJsData(value);
    isSyncingFromValueRef.current = true;
    editorRef.current
      .render(nextData)
      .then(() => {
        setEditorDataForPreview(normalizeEditorJsData(nextData));
        setFallbackHtml(renderEditorJsToHtml(nextData));
        lastSyncedValueRef.current = incomingValue;
      })
      .catch(() => {
        // Ignore render sync failures and keep editor state intact.
      })
      .finally(() => {
        isSyncingFromValueRef.current = false;
      });
  }, [isReady, parsedEditorData, value]);

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <EditorToolbar showPreview={showPreview} isPreview={isPreview} onTogglePreview={() => setIsPreview((previous) => !previous)} />

      <div className="relative" style={{ height }}>
        {isPreview ? (
          <div className="absolute inset-0 p-4 overflow-y-auto bg-background" dir="ltr">
            {previewHtml ? (
              <div
                className="prose prose-sm max-w-none ltr [&_ol]:list-decimal [&_ol]:pl-6 [&_ul]:list-disc [&_ul]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-accent/40 [&_blockquote]:pl-5 [&_blockquote]:italic [&_h2]:text-2xl [&_h3]:text-xl [&_pre]:rounded-md [&_pre]:bg-muted [&_pre]:p-4"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            ) : (
              <div className="text-muted-foreground text-sm">{placeholder}</div>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 bg-background">
            <div
              id={holderId}
              className="editorjs-root h-full overflow-y-auto p-4 ltr"
              style={{
                direction: "ltr",
                textAlign: "left",
                unicodeBidi: "plaintext",
                minHeight: height,
              }}
            />
            {!isReady ? (
              <div className="absolute top-4 left-4 text-sm text-muted-foreground pointer-events-none">{placeholder}</div>
            ) : null}
          </div>
        )}
      </div>

      <textarea
        name="content"
        value={typeof value === "string" ? value : JSON.stringify(value || EMPTY_EDITOR_DATA)}
        onChange={(event) => onChange?.(event.target.value)}
        className="hidden"
        dir="ltr"
        readOnly
      />
    </div>
  );
}

export function HTMLInput({ value = "", onChange, placeholder = "Enter HTML..." }) {
  const [isHTMLView, setIsHTMLView] = useState(false);
  const safeValue = String(value || "");

  const handleContentChange = (nextValue) => {
    onChange?.(nextValue);
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="border-b border-border bg-muted/30 p-2 flex items-center justify-between">
        <span className="text-sm font-medium">{isHTMLView ? "JSON Source" : "Editor"}</span>
        <button
          type="button"
          onClick={() => setIsHTMLView((previous) => !previous)}
          className="p-2 rounded hover:bg-secondary/60 transition-colors"
          title={isHTMLView ? "Editor" : "JSON Source"}
        >
          <Code className="h-4 w-4" />
        </button>
      </div>

      {isHTMLView ? (
        <textarea
          value={safeValue}
          onChange={(event) => handleContentChange(event.target.value)}
          placeholder={placeholder}
          className="w-full p-4 bg-background outline-none resize-none font-mono text-sm"
          rows={12}
          dir="ltr"
        />
      ) : (
        <RichTextEditor value={safeValue} onChange={handleContentChange} placeholder={placeholder} height="300px" showPreview={true} />
      )}
    </div>
  );
}
