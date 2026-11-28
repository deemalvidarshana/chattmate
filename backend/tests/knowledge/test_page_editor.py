from types import SimpleNamespace
from unittest.mock import MagicMock

from app.knowledge.page_editor import ensure_vector_store, split_text_for_embedding


def test_split_text_for_embedding_keeps_chunks_within_limit():
    content = "\n\n".join(
        f"Section {index}: " + ("customer support automation " * 20)
        for index in range(20)
    )

    chunks = split_text_for_embedding(content, chunk_size=300, overlap=40)

    assert len(chunks) > 1
    assert all(chunk for chunk in chunks)
    assert all(len(chunk) <= 300 for chunk in chunks)
    assert chunks[0].startswith("Section 0")
    assert any("Section 19" in chunk for chunk in chunks)


def test_split_text_for_embedding_leaves_short_text_unchanged():
    content = "A short knowledge source."

    assert split_text_for_embedding(content, chunk_size=300, overlap=40) == [content]


def test_split_text_for_embedding_always_makes_progress():
    chunks = split_text_for_embedding("x" * 1000, chunk_size=100, overlap=99)

    assert chunks
    assert all(0 < len(chunk) <= 100 for chunk in chunks)
    assert chunks[-1].endswith("x")


def test_ensure_vector_store_creates_missing_tenant_table():
    vector_db = MagicMock()
    vector_db.exists.return_value = False
    manager = SimpleNamespace(vector_db=vector_db)

    ensure_vector_store(manager)

    vector_db.create.assert_called_once_with()


def test_ensure_vector_store_keeps_existing_tenant_table():
    vector_db = MagicMock()
    vector_db.exists.return_value = True
    manager = SimpleNamespace(vector_db=vector_db)

    ensure_vector_store(manager)

    vector_db.create.assert_not_called()
