function _createModal(options) {
    const DEFAULT_WIDTH = '600px' 
    const modal = document.createElement('div')
    modal.classList.add('vmodal')
    modal.insertAdjacentHTML('afterbegin', `
        <div class="modal-window" style="width: ${options.width || DEFAULT_WIDTH}">
          <div class="modal-header">
            ${options.closable ? `<span class="modal-close" data-close="true">&times;</span>` : ''}
          </div>
          <div class="modal-body" data-content>
           ${options.content || ''}
          </div>
        </div> 
    `)
    document.body.appendChild(modal)
    return modal
  }
  
  $.modal = function(options) {
    const ANIMATION_SPEED = 200
    const $modal = _createModal(options)
    let closing = false
  
    const modal = {
      open() {
        !closing && $modal.classList.add('open')
      },
      close() {
        closing = true
        $modal.classList.remove('open')
        $modal.classList.add('hide')
        setTimeout(() => {
          $modal.classList.remove('hide')
          closing = false
        }, ANIMATION_SPEED)
      }
    }

    $modal.addEventListener('click', event => {
      if(event.target.dataset.close){
        modal.close()
      }
    })

    return Object.assign(modal, {
      setContent(html) {
        $modal.querySelector('[data-content]').innerHTML = html
      },

    })
  }
  