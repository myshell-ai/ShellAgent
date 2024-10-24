FasdUAS 1.101.10   ��   ��    k             l     ��  ��    . ( Determine the path of the script itself     � 	 	 P   D e t e r m i n e   t h e   p a t h   o f   t h e   s c r i p t   i t s e l f   
  
 l    	 ����  r     	    I    ��  
�� .earsffdralis        afdr   f       �� ��
�� 
rtyp  m    ��
�� 
TEXT��    o      ���� 0 thisfilepath thisFilePath��  ��        l     ��  ��    8 2 Convert to POSIX path (standard file system path)     �   d   C o n v e r t   t o   P O S I X   p a t h   ( s t a n d a r d   f i l e   s y s t e m   p a t h )      l  
  ����  r   
     n   
     1    ��
�� 
psxp  l  
  ����  b   
      l  
  !���� ! o   
 ���� 0 thisfilepath thisFilePath��  ��     m     " " � # #  : :��  ��    o      ����  0 thisfolderpath thisFolderPath��  ��     $ % $ l     �� & '��   & ( " Prepare the shell script commands    ' � ( ( D   P r e p a r e   t h e   s h e l l   s c r i p t   c o m m a n d s %  ) * ) l    +���� + r     , - , b     . / . b     0 1 0 m     2 2 � 3 3 
 
 c d   ' 1 o    ����  0 thisfolderpath thisFolderPath / m     4 4 � 5 5 ' 
 
 e c h o   " = = = = = = = = = = = = = = = = = = = = = = = = = = = >   S t a r t S h e l l A g e n t     v . 1 . 0 . 0     < = = = = = = = = = = = = = = = = = = = = = = = = = = = " 
 
 e c h o   " = = = = = = = = = >   S o u r c e   M i n i c o n d a   a n d   i n i t i a l i z e   C o n d a " 
 s o u r c e   " . / m i n i c o n d a / e t c / p r o f i l e . d / c o n d a . s h " 
 c o n d a   i n i t 
 e c h o   " = = = = = = = = = >   A c t i v a t e   C o n d a   e n v i r o n m e n t   ' s h e l l a g e n t ' " 
 c o n d a   a c t i v a t e   s h e l l a g e n t 
 
 e c h o   " = = = = = = = = = >   C h e c k   w h i c h   P y t h o n   i s   b e i n g   u s e d " 
 w h i c h   p y t h o n 
 
 e c h o   " = = = = = = = = = >   C h a n g e   d i r e c t o r y " 
 c d   S h e l l A g e n t 
 
 e c h o   " = = = = = = = = = >   S t a r t   S h e l l A g e n t   i n s i d e   o f   t h e   e n v i r o n m e n t " 
 k i l l _ s e r v e r _ o n _ p o r t ( )   { 
         e c h o   " = = = = = = = = = >       C h e c k i n g   i f   a   s e r v e r   i s   r u n n i n g   o n   p o r t   $ 1 . . . " 
         s e r v e r _ p i d = $ ( l s o f   - i   : $ 1   |   g r e p   L I S T E N   |   a w k   ' { p r i n t   $ 2 } ' ) 
         i f   [   - n   " $ s e r v e r _ p i d "   ] ;   t h e n 
                 e c h o   " = = = = = = = = = >       S e r v e r   f o u n d   w i t h   P I D   $ s e r v e r _ p i d .   K i l l i n g   s e r v e r . . . " 
                 k i l l   - 9   $ s e r v e r _ p i d 
                 e c h o   " = = = = = = = = = >       S e r v e r   o n   p o r t   $ 1   h a s   b e e n   k i l l e d . " 
         e l s e 
                 e c h o   " = = = = = = = = = >       N o   s e r v e r   i s   c u r r e n t l y   r u n n i n g   o n   p o r t   $ 1 . " 
         f i 
 } 
 k i l l _ s e r v e r _ o n _ p o r t   8 0 9 9 
 p y t h o n   s e r v e r s / m a i n . p y   & 
 
 s l e e p   1 0 
 e c h o   " = = = = = = = = = > O p e n   B r o w s e r   " 
 o p e n   h t t p : / / 1 2 7 . 0 . 0 . 1 : 8 0 9 9 
 - o      ���� 0 shellscript shellScript��  ��   *  6 7 6 l     ��������  ��  ��   7  8 9 8 l     �� : ;��   : + % Execute the shell script in Terminal    ; � < < J   E x e c u t e   t h e   s h e l l   s c r i p t   i n   T e r m i n a l 9  =�� = l   , >���� > O    , ? @ ? k    + A A  B C B I   #������
�� .miscactvnull��� ��� null��  ��   C  D E D I  $ )�� F��
�� .coredoscnull��� ��� ctxt F o   $ %���� 0 shellscript shellScript��   E  G�� G l  * *��������  ��  ��  ��   @ m     H H�                                                                                      @ alis    8  �˵���                     � ;yBD ����Terminal.app                                                   ����� ;y        ����  
 cu             	Utilities   -/:System:Applications:Utilities:Terminal.app/     T e r m i n a l . a p p   kdu5�  *System/Applications/Utilities/Terminal.app  / ��  ��  ��  ��       �� I J K L M��   I ��������
�� .aevtoappnull  �   � ****�� 0 thisfilepath thisFilePath��  0 thisfolderpath thisFolderPath�� 0 shellscript shellScript J �� N���� O P��
�� .aevtoappnull  �   � **** N k     , Q Q  
 R R   S S  ) T T  =����  ��  ��   O   P �������� "���� 2 4�� H����
�� 
rtyp
�� 
TEXT
�� .earsffdralis        afdr�� 0 thisfilepath thisFilePath
�� 
psxp��  0 thisfolderpath thisFolderPath�� 0 shellscript shellScript
�� .miscactvnull��� ��� null
�� .coredoscnull��� ��� ctxt�� -)��l E�O��%�,E�O��%�%E�O� *j O�j OPU K � U U rkdu5� : U s e r s : l i b o j i e : D e s k t o p :g*T}Te�N�Y9 : S t a r t C o m f y U I . a p p l e s c r i p t L � V V < / U s e r s / l i b o j i e / D e s k t o p /g*T}Te�N�Y9 / M � W W` 
 c d   ' / U s e r s / l i b o j i e / D e s k t o p /g*T}Te�N�Y9 / ' 
 
 e c h o   " = = = = = = = = = = = = = = = = = = = = = = = = = = = >   S t a r t S h e l l A g e n t     v . 1 . 0 . 0     < = = = = = = = = = = = = = = = = = = = = = = = = = = = " 
 
 e c h o   " = = = = = = = = = >   S o u r c e   M i n i c o n d a   a n d   i n i t i a l i z e   C o n d a " 
 s o u r c e   " . / m i n i c o n d a / e t c / p r o f i l e . d / c o n d a . s h " 
 c o n d a   i n i t 
 e c h o   " = = = = = = = = = >   A c t i v a t e   C o n d a   e n v i r o n m e n t   ' s h e l l a g e n t ' " 
 c o n d a   a c t i v a t e   s h e l l a g e n t 
 
 e c h o   " = = = = = = = = = >   C h e c k   w h i c h   P y t h o n   i s   b e i n g   u s e d " 
 w h i c h   p y t h o n 
 
 e c h o   " = = = = = = = = = >   C h a n g e   d i r e c t o r y " 
 c d   S h e l l A g e n t 
 
 e c h o   " = = = = = = = = = >   S t a r t   S h e l l A g e n t   i n s i d e   o f   t h e   e n v i r o n m e n t " 
 k i l l _ s e r v e r _ o n _ p o r t ( )   { 
         e c h o   " = = = = = = = = = >       C h e c k i n g   i f   a   s e r v e r   i s   r u n n i n g   o n   p o r t   $ 1 . . . " 
         s e r v e r _ p i d = $ ( l s o f   - i   : $ 1   |   g r e p   L I S T E N   |   a w k   ' { p r i n t   $ 2 } ' ) 
         i f   [   - n   " $ s e r v e r _ p i d "   ] ;   t h e n 
                 e c h o   " = = = = = = = = = >       S e r v e r   f o u n d   w i t h   P I D   $ s e r v e r _ p i d .   K i l l i n g   s e r v e r . . . " 
                 k i l l   - 9   $ s e r v e r _ p i d 
                 e c h o   " = = = = = = = = = >       S e r v e r   o n   p o r t   $ 1   h a s   b e e n   k i l l e d . " 
         e l s e 
                 e c h o   " = = = = = = = = = >       N o   s e r v e r   i s   c u r r e n t l y   r u n n i n g   o n   p o r t   $ 1 . " 
         f i 
 } 
 k i l l _ s e r v e r _ o n _ p o r t   8 0 9 9 
 p y t h o n   s e r v e r s / m a i n . p y   & 
 
 s l e e p   1 0 
 e c h o   " = = = = = = = = = > O p e n   B r o w s e r   " 
 o p e n   h t t p : / / 1 2 7 . 0 . 0 . 1 : 8 0 9 9 
 ascr  ��ޭ