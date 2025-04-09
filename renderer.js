// DOM Elements
const memoItemsContainer = document.getElementById('memo-items');
const newMemoButton = document.getElementById('new-memo');
const saveMemoButton = document.getElementById('save-memo');
const deleteMemoButton = document.getElementById('delete-memo');
const memoIdInput = document.getElementById('memo-id');
const memoTitleInput = document.getElementById('memo-title');
const memoContentTextarea = document.getElementById('memo-content');

let currentMemoId = null;
let memos = [];

// Load memos from database
async function loadMemos() {
  try {
    memos = await window.api.getMemos();
    renderMemoList();
  } catch (error) {
    console.error('Failed to load memos:', error);
  }
}

// Render memo list
function renderMemoList() {
  memoItemsContainer.innerHTML = '';
  
  memos.forEach(memo => {
    const memoItem = document.createElement('div');
    memoItem.className = 'memo-item';
    if (memo.id == currentMemoId) {
      memoItem.classList.add('selected');
    }
    
    memoItem.innerHTML = `
      <strong>${memo.title || 'Untitled'}</strong>
      <p>${memo.content?.substring(0, 50)}${memo.content?.length > 50 ? '...' : ''}</p>
    `;
    
    memoItem.addEventListener('click', () => selectMemo(memo));
    memoItemsContainer.appendChild(memoItem);
  });
}

// Select a memo
function selectMemo(memo) {
  currentMemoId = memo.id;
  memoIdInput.value = memo.id;
  memoTitleInput.value = memo.title || '';
  memoContentTextarea.value = memo.content || '';
  
  // Update selected state in UI
  document.querySelectorAll('.memo-item').forEach(item => {
    item.classList.remove('selected');
  });
  
  renderMemoList();
}

// Create new memo
function createNewMemo() {
  currentMemoId = null;
  memoIdInput.value = '';
  memoTitleInput.value = '';
  memoContentTextarea.value = '';
  
  // Clear selected state in UI
  document.querySelectorAll('.memo-item').forEach(item => {
    item.classList.remove('selected');
  });
}

// Save memo
async function saveMemo() {
  const title = memoTitleInput.value.trim();
  const content = memoContentTextarea.value.trim();
  
  if (!title && !content) {
    alert('Please enter a title or content');
    return;
  }
  
  try {
    if (currentMemoId) {
      // Update existing memo
      await window.api.updateMemo({
        id: currentMemoId,
        title,
        content
      });
    } else {
      // Create new memo
      const newMemo = await window.api.addMemo({ title, content });
      currentMemoId = newMemo.id;
    }
    
    loadMemos();
  } catch (error) {
    console.error('Failed to save memo:', error);
    alert('Failed to save memo');
  }
}

// Delete memo
async function deleteMemo() {
  if (!currentMemoId) return;
  
  if (confirm('Are you sure you want to delete this memo?')) {
    try {
      await window.api.deleteMemo(currentMemoId);
      createNewMemo();
      loadMemos();
    } catch (error) {
      console.error('Failed to delete memo:', error);
      alert('Failed to delete memo');
    }
  }
}

// Event listeners
newMemoButton.addEventListener('click', createNewMemo);
saveMemoButton.addEventListener('click', saveMemo);
deleteMemoButton.addEventListener('click', deleteMemo);

// Initial load
document.addEventListener('DOMContentLoaded', () => {
  loadMemos();
  createNewMemo();
});
